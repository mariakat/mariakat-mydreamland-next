// Latest posts from @mydreamlandbl through the official Instagram API
// (Instagram API with Instagram Login). Server-side only.
//
// The access token starts in the INSTAGRAM_ACCESS_TOKEN environment variable
// (set in cPanel). Tokens last 60 days, so we refresh it about once a week
// and keep the newest one in a small file outside the git repository.

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

const API_VERSION = "v25.0";
const POSTS_TO_SHOW = 6;
const CACHE_MS = 60 * 60 * 1000; // ask Instagram at most once an hour
const RETRY_AFTER_ERROR_MS = 10 * 60 * 1000;
const REFRESH_EVERY_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_RETRY_MS = 6 * 60 * 60 * 1000;

export type InstagramPost = {
  id: string;
  imageUrl: string;
  permalink: string;
  caption: string | null;
  altText: string | null;
  isVideo: boolean;
  timestamp: string;
};

type TokenState = {
  token: string;
  refreshedAt: number; // 0 = never refreshed by us
  lastAttempt?: number;
  envFingerprint: string; // which INSTAGRAM_ACCESS_TOKEN this came from
};

type GraphMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  alt_text?: string;
};

function graphUrl(): string {
  return (process.env.INSTAGRAM_GRAPH_URL || "https://graph.instagram.com").replace(/\/$/, "");
}

function tokenFile(): string {
  return (
    process.env.INSTAGRAM_TOKEN_FILE ||
    path.join(os.homedir(), ".mydreamland", "instagram-token.json")
  );
}

function fingerprint(token: string): string {
  return createHash("sha256").update(token).digest("hex").slice(0, 16);
}

// The token to use: the refreshed one from the file, unless a different
// token was put in cPanel since (then the new one wins).
async function loadToken(): Promise<TokenState | null> {
  const envToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (!envToken) return null;
  const envFingerprint = fingerprint(envToken);
  try {
    const saved = JSON.parse(await fs.readFile(tokenFile(), "utf8")) as TokenState;
    if (saved.token && saved.envFingerprint === envFingerprint) return saved;
  } catch {
    // no file yet
  }
  return { token: envToken, refreshedAt: 0, envFingerprint };
}

async function saveToken(state: TokenState): Promise<void> {
  const file = tokenFile();
  await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  await fs.writeFile(file, JSON.stringify(state), { mode: 0o600 });
}

// Instagram only refreshes tokens that are at least 24 hours old; a failed
// attempt is simply retried a few hours later.
async function refreshIfDue(state: TokenState): Promise<TokenState> {
  const now = Date.now();
  if (now - state.refreshedAt < REFRESH_EVERY_MS) return state;
  if (state.lastAttempt && now - state.lastAttempt < REFRESH_RETRY_MS) return state;

  try {
    const url = new URL(`${graphUrl()}/refresh_access_token`);
    url.searchParams.set("grant_type", "ig_refresh_token");
    url.searchParams.set("access_token", state.token);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`refresh failed: ${res.status} ${await res.text()}`);
    const body = (await res.json()) as { access_token?: string };
    if (!body.access_token) throw new Error("refresh returned no token");
    const next: TokenState = {
      token: body.access_token,
      refreshedAt: now,
      envFingerprint: state.envFingerprint,
    };
    await saveToken(next);
    console.log("[instagram] access token refreshed");
    return next;
  } catch (error) {
    console.error("[instagram] could not refresh the access token:", error);
    const next = { ...state, lastAttempt: now };
    await saveToken(next).catch(() => {});
    return next;
  }
}

async function fetchPosts(): Promise<InstagramPost[]> {
  const loaded = await loadToken();
  if (!loaded) return [];
  const state = await refreshIfDue(loaded);

  const url = new URL(`${graphUrl()}/${API_VERSION}/me/media`);
  url.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,alt_text",
  );
  url.searchParams.set("limit", String(POSTS_TO_SHOW));
  url.searchParams.set("access_token", state.token);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Instagram media request failed: ${res.status} ${await res.text()}`);
  }
  const body = (await res.json()) as { data?: GraphMedia[] };
  return (body.data ?? [])
    .map((m): InstagramPost | null => {
      const imageUrl = m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url;
      if (!imageUrl) return null;
      return {
        id: m.id,
        imageUrl,
        permalink: m.permalink,
        caption: m.caption ?? null,
        altText: m.alt_text ?? null,
        isVideo: m.media_type === "VIDEO",
        timestamp: m.timestamp,
      };
    })
    .filter((p): p is InstagramPost => p !== null)
    .slice(0, POSTS_TO_SHOW);
}

// In-memory cache per server process. Image links from Instagram expire after
// a while, so the list is fetched again every hour.
let cache: { posts: InstagramPost[]; expires: number } | null = null;
let inFlight: Promise<InstagramPost[]> | null = null;

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  if (cache && cache.expires > Date.now()) return cache.posts;
  if (inFlight) return inFlight;

  inFlight = fetchPosts()
    .then((posts) => {
      cache = { posts, expires: Date.now() + CACHE_MS };
      return posts;
    })
    .catch((error) => {
      console.error("[instagram] could not load posts:", error);
      // Keep showing the last good posts for a bit; otherwise show none.
      const posts = cache?.posts ?? [];
      cache = { posts, expires: Date.now() + RETRY_AFTER_ERROR_MS };
      return posts;
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}
