import { NextRequest, NextResponse } from "next/server";

/**
 * Forwards /api/backend/* to the real backend and adds the in-house access
 * token on the server, so the token is never sent to browsers.
 * A rewrite streams the request body, so large uploads aren't buffered here.
 */
const PROXY_PREFIX = "/api/backend";

export function middleware(req: NextRequest) {
  const upstream = (
    process.env.BACKEND_API_URL ??
    process.env.NEXT_PUBLIC_BACKEND_API_URL ??
    ""
  )
    .trim()
    .replace(/\/$/, "");
  const token = (process.env.INHOUSE_API_ACCESS_TOKEN ?? "").trim();
  const headerName = (process.env.API_ACCESS_HEADER ?? "X-Inhouse-Access-Token").trim();

  if (!upstream) {
    return NextResponse.json({ message: "Backend URL is not configured" }, { status: 500 });
  }

  const path = req.nextUrl.pathname.slice(PROXY_PREFIX.length);
  const target = new URL(`${upstream}${path}${req.nextUrl.search}`);

  const headers = new Headers(req.headers);
  // Never trust a token sent by the client; always use the server's.
  headers.delete(headerName);
  if (token) headers.set(headerName, token);

  // Keep the real client IP visible to the backend (for rate limiting/logs).
  const clientIp = req.ip ?? req.headers.get("x-real-ip");
  if (clientIp && !headers.get("x-forwarded-for")) {
    headers.set("x-forwarded-for", clientIp);
  }

  return NextResponse.rewrite(target, { request: { headers } });
}

export const config = {
  matcher: "/api/backend/:path*",
};
