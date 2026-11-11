import { NextRequest, NextResponse } from "next/server";
import { COLLATION_PATHS, collationEnabled, pulseHost } from "./app/utils/features";

/**
 * Forwards /api/backend/* to the real backend and adds the in-house access
 * token on the server, so the token is never sent to browsers.
 * A rewrite streams the request body, so large uploads aren't buffered here.
 */
const PROXY_PREFIX = "/api/backend";

/** Backend routes that exist only under /api/v1 on the deployed API. */
const V1_ONLY_PREFIXES = ["/mobile/news-insights"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(PROXY_PREFIX)) {
    const pulseRoute = routePulseHost(req);
    if (pulseRoute) return pulseRoute;

    // Results/Collation is switched off: send its pages to the homepage
    const isCollation = COLLATION_PATHS.some(
      (base) => pathname === base || pathname.startsWith(`${base}/`)
    );
    if (isCollation && !collationEnabled) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

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
  // The backend serves News & Insight only under /api/v1 (not /api), so
  // route those calls to v1 when the configured URL ends in /api.
  const base =
    /\/api$/.test(upstream) && V1_ONLY_PREFIXES.some((p) => path.startsWith(p))
      ? `${upstream}/v1`
      : upstream;
  const target = new URL(`${base}${path}${req.nextUrl.search}`);

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

/**
 * Pulse lives at the root of its own host (e.g. pulse.citizenmonitors.com).
 * On that host "/" shows Pulse; elsewhere /pulse redirects there.
 */
function routePulseHost(req: NextRequest): NextResponse | null {
  if (!pulseHost) return null;
  const { pathname, search } = req.nextUrl;
  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").toLowerCase();
  const isPulsePath = pathname === "/pulse" || pathname.startsWith("/pulse/");

  const pulseRoot = `${req.nextUrl.protocol || "https:"}//${pulseHost}/${search}`;

  if (host === pulseHost) {
    if (pathname === "/") return NextResponse.rewrite(new URL(`/pulse${search}`, req.url));
    if (isPulsePath) return NextResponse.redirect(pulseRoot);
    // Every other page (nav, footer, Newsletter, login…) lives on the main site
    return NextResponse.redirect(`${mainSiteOrigin(req)}${pathname}${search}`);
  }
  return isPulsePath ? NextResponse.redirect(pulseRoot) : null;
}

/** Main site origin, e.g. https://www.citizenmonitors.com */
function mainSiteOrigin(req: NextRequest): string {
  const configured = (process.env.METADATA_BASEURL ?? "").trim().replace(/\/$/, "");
  if (configured) return configured;
  const proto = req.nextUrl.protocol || "https:";
  return `${proto}//${pulseHost.replace(/^pulse\./, "www.")}`;
}

export const config = {
  // All pages (so the Pulse host can send non-Pulse pages to the main site),
  // plus the backend proxy. Skips Next.js assets, other API routes and files.
  matcher: ["/api/backend/:path*", "/((?!api/|_next/|.*\\..*).*)"],
};
