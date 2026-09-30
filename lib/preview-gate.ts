// Shared helpers for the temporary "coming soon" password gate.
// The password itself lives only in the SITE_PASSWORD environment variable
// (set in cPanel), never in the code or in git.

export const PREVIEW_COOKIE = "mdl_preview";

// The cookie stores a hash derived from the password, not the password.
// Changing SITE_PASSWORD in cPanel therefore invalidates every old cookie.
export async function previewToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`mydreamland-preview:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

// Constant-time comparison so response timing doesn't leak how much matched.
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function sitePassword(): string | undefined {
  const value = process.env.SITE_PASSWORD;
  return value && value.length > 0 ? value : undefined;
}
