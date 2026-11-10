import { NextResponse } from "next/server";
import { NEWSLETTER_COOKIE, newsletterCookieOptions } from "@/app/utils/newsletterAuth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(NEWSLETTER_COOKIE, "", { ...newsletterCookieOptions(), maxAge: 0 });
  return res;
}
