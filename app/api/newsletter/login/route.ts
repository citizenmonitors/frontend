import { NextRequest, NextResponse } from "next/server";
import {
  NEWSLETTER_COOKIE,
  checkNewsletterCredentials,
  createNewsletterSession,
  newsletterConfigured,
  newsletterCookieOptions,
} from "@/app/utils/newsletterAuth";

// Simple per-instance throttle: 5 failed tries per IP per 15 minutes
const failures = new Map<string, { count: number; until: number }>();
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60_000;

export async function POST(req: NextRequest) {
  if (!newsletterConfigured()) {
    return NextResponse.json({ message: "Newsletter page login is not set up." }, { status: 503 });
  }

  const ip = req.ip ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const entry = failures.get(ip);
  if (entry && entry.until > Date.now() && entry.count >= MAX_FAILURES) {
    return NextResponse.json(
      { message: "Too many attempts. Try again in a few minutes." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!(await checkNewsletterCredentials(username, password))) {
    const fresh = !entry || entry.until <= Date.now();
    failures.set(ip, {
      count: fresh ? 1 : entry!.count + 1,
      until: fresh ? Date.now() + WINDOW_MS : entry!.until,
    });
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ message: "Wrong username or password." }, { status: 401 });
  }

  failures.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(NEWSLETTER_COOKIE, await createNewsletterSession(username.trim()), newsletterCookieOptions());
  return res;
}
