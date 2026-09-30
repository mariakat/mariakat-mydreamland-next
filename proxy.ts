import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PREVIEW_COOKIE,
  previewToken,
  safeEqual,
  sitePassword,
} from "@/lib/preview-gate";

// Everyone without a valid preview cookie sees the coming-soon page,
// whatever URL they open. The URL in the address bar stays the same.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The unlock endpoint and the coming-soon page itself must stay reachable.
  if (pathname === "/api/unlock" || pathname === "/coming-soon") {
    return NextResponse.next();
  }

  const password = sitePassword();
  const cookie = request.cookies.get(PREVIEW_COOKIE)?.value;

  if (password && cookie && safeEqual(cookie, await previewToken(password))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  return NextResponse.rewrite(url);
}

export const config = {
  // Static assets (JS/CSS, fonts, images) must load for the coming-soon page.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|svg|webp|ico|woff2?)$).*)",
  ],
};
