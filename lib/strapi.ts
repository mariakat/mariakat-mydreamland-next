// Server-side access to the Strapi CMS. Everything here runs on the server
// only (Server Components), so the API token never reaches the browser.

import { unstable_rethrow } from "next/navigation";
import { cache } from "react";
import type { CategoryName } from "./categories";

export function cmsUrl(): string {
  const url =
    process.env.STRAPI_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "https://cms.mydreamland.gr";
  return url.replace(/\/$/, "");
}

export type StrapiMedia = {
  url: string;
  alternativeText: string | null;
  width: number | null;
  height: number | null;
};

export type Tag = { id: number; documentId: string; name: string; slug: string };

export type ReviewCard = {
  kind: "Ταινία" | "Σειρά" | "Βιβλίο";
  title: string;
  creator: string | null;
  year: number | null;
  genre: string | null;
  whereToFind: string | null;
  poster: StrapiMedia | null;
  rating: number | null;
};

export type Article = {
  id: number;
  documentId: string;
  title: string;
  subtitle: string | null;
  slug: string;
  category: CategoryName;
  excerpt: string | null;
  body: string | null;
  coverImage: StrapiMedia | null;
  readingTime: number | null;
  featured: boolean | null;
  publishedAt: string;
  tags?: Tag[];
  reviewCard?: ReviewCard | null;
};

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

type ListResponse<T> = { data: T[]; meta: { pagination: Pagination } };

export class StrapiNotFoundError extends Error {}

async function strapiGet<T>(path: string, params: URLSearchParams): Promise<T> {
  const token = process.env.STRAPI_API_TOKEN;
  const res = await fetch(`${cmsUrl()}/api/${path}?${params.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    // Always fresh: a new article appears as soon as it's published.
    cache: "no-store",
  });
  if (res.status === 404) {
    throw new StrapiNotFoundError(`Strapi /api/${path}: not found`);
  }
  if (!res.ok) {
    throw new Error(`Strapi request /api/${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getArticles(
  options: {
    page?: number;
    pageSize?: number;
    category?: CategoryName;
    featured?: boolean;
  } = {},
): Promise<ListResponse<Article>> {
  const params = new URLSearchParams();
  params.set("sort", "publishedAt:desc");
  params.set("pagination[page]", String(options.page ?? 1));
  params.set("pagination[pageSize]", String(options.pageSize ?? 10));
  params.set("populate[0]", "coverImage");
  if (options.category) params.set("filters[category][$eq]", options.category);
  if (options.featured) params.set("filters[featured][$eq]", "true");
  return strapiGet<ListResponse<Article>>("articles", params);
}

// One article by its slug, with everything the article page shows.
// Wrapped in cache() so the page and its metadata share one request.
export const getArticleBySlug = cache(async (slug: string) => {
  const params = new URLSearchParams();
  params.set("filters[slug][$eq]", slug);
  params.set("pagination[pageSize]", "1");
  params.set("populate[0]", "coverImage");
  params.set("populate[1]", "tags");
  params.set("populate[2]", "reviewCard.poster");
  const res = await strapiGet<ListResponse<Article>>("articles", params);
  return res.data[0] ?? null;
});

export type SiteSettings = {
  authorName: string | null;
  authorPhoto: StrapiMedia | null;
  authorBio: string | null;
};

const EMPTY_SETTINGS: SiteSettings = {
  authorName: null,
  authorPhoto: null,
  authorBio: null,
};

// "Ρυθμίσεις site" from the CMS. Never fails the page: if the entry was
// never saved or the CMS is unreachable, callers fall back to defaults.
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const params = new URLSearchParams();
    params.set("populate[0]", "authorPhoto");
    const res = await strapiGet<{ data: SiteSettings | null }>(
      "site-setting",
      params,
    );
    return { ...EMPTY_SETTINGS, ...(res.data ?? {}) };
  } catch (error) {
    unstable_rethrow(error);
    if (!(error instanceof StrapiNotFoundError)) {
      console.error("[settings] could not load site settings:", error);
    }
    return EMPTY_SETTINGS;
  }
});

export function mediaUrl(media: StrapiMedia | null | undefined): string | null {
  return absoluteCmsUrl(media?.url);
}

// Uploads come back as "/uploads/…"; the browser needs the CMS address too.
export function absoluteCmsUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return /^(https?:)?\/\//.test(url) || url.startsWith("data:")
    ? url
    : `${cmsUrl()}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Plain-text excerpt: the excerpt field, or the start of the body without markdown.
export function articleExcerpt(article: Article, maxLength = 170): string {
  const source =
    article.excerpt ||
    (article.body ?? "")
      .replace(/^#{1,6}\s.*$/gm, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[#>*_`~-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  if (source.length <= maxLength) return source;
  return `${source.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}

// Minutes to read: the readingTime field, or ~200 words per minute.
export function articleReadingTime(article: Article): number {
  if (article.readingTime) return article.readingTime;
  const words = (article.body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("el-GR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Athens",
  }).format(new Date(iso));
}
