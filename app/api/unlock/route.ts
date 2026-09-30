import { NextResponse } from "next/server";
import {
  PREVIEW_COOKIE,
  previewToken,
  safeEqual,
  sitePassword,
} from "@/lib/preview-gate";

// Relative Location headers keep the redirect on the public domain, even
// though the app itself runs behind LiteSpeed on an internal port.
function redirectTo(location: string) {
  return new NextResponse(null, { status: 303, headers: { Location: location } });
}

export async function POST(request: Request) {
  const password = sitePassword();
  if (!password) {
    console.error("[preview-gate] SITE_PASSWORD is not set; nobody can unlock the site.");
    return redirectTo("/?error=1");
  }

  const form = await request.formData();
  const submitted = String(form.get("password") ?? "");

  const expected = await previewToken(password);
  const given = await previewToken(submitted);

  if (!safeEqual(given, expected)) {
    return redirectTo("/?error=1");
  }

  const response = redirectTo("/");
  // No maxAge/expires: a session cookie, gone when the browser closes.
  response.cookies.set(PREVIEW_COOKIE, expected, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  return response;
}
