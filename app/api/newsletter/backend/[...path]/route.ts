import { NextRequest, NextResponse } from "next/server";
import { NEWSLETTER_COOKIE, readNewsletterSession } from "@/app/utils/newsletterAuth";
import {
  accessHeaders,
  getServiceToken,
  newsletterBackendConfigured,
  upstreamBase,
} from "@/app/utils/newsletterBackend";

/**
 * The Newsletter page's only way to reach the backend. Checks its session, then
 * calls the backend as the service admin account. Limited to newsletter and
 * News & Insight admin routes.
 */
const ALLOWED_PREFIXES = ["admin/newsletter", "admin/news-insights"];

export const dynamic = "force-dynamic";
// Sending a newsletter to a large list can take a while
export const maxDuration = 300;

async function handle(req: NextRequest, { params }: { params: { path: string[] } }) {
  if (!(await readNewsletterSession(req.cookies.get(NEWSLETTER_COOKIE)?.value))) {
    return NextResponse.json({ message: "Please log in to the Newsletter page." }, { status: 401 });
  }
  const path = params.path.map(encodeURIComponent).join("/");
  if (!ALLOWED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) {
    return NextResponse.json({ message: "Not available from the Newsletter page." }, { status: 403 });
  }

  if (!newsletterBackendConfigured()) {
    return NextResponse.json({ message: "Newsletter page backend access is not set up." }, { status: 503 });
  }

  const target = `${upstreamBase()}/${path}${req.nextUrl.search}`;
  const hasBody = !["GET", "HEAD"].includes(req.method);
  // Buffer once so the request can be retried after a fresh sign-in
  const body = hasBody ? await req.arrayBuffer() : undefined;
  const contentType = req.headers.get("content-type");

  const send = async (token: string) =>
    fetch(target, {
      method: req.method,
      headers: {
        ...accessHeaders(),
        Authorization: `Bearer ${token}`,
        ...(contentType ? { "Content-Type": contentType } : {}),
        Accept: req.headers.get("accept") ?? "application/json",
      },
      body,
      cache: "no-store",
    });

  try {
    let upstream = await send(await getServiceToken());
    if (upstream.status === 401) upstream = await send(await getServiceToken(true));

    const headers = new Headers();
    const type = upstream.headers.get("content-type");
    if (type) headers.set("content-type", type);
    return new NextResponse(upstream.body, { status: upstream.status, headers });
  } catch (error) {
    console.error("[newsletter] backend request failed:", error);
    return NextResponse.json(
      { message: "Newsletter could not reach the backend. Try again shortly." },
      { status: 502 }
    );
  }
}

export { handle as GET, handle as POST, handle as PATCH, handle as PUT, handle as DELETE };
