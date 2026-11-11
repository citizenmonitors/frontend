"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { pulseHost } from "@/app/utils/features";

/** Main site origin, used when a page is viewed on the Pulse host. */
const mainSiteOrigin = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (pulseHost ? `https://${pulseHost.replace(/^pulse\./, "www.")}` : "")
).replace(/\/$/, "");

function toMainSite(href: string): string {
  if (!pulseHost || !mainSiteOrigin || !href.startsWith("/")) return href;
  if (typeof window === "undefined" || window.location.host.toLowerCase() !== pulseHost) return href;
  return `${mainSiteOrigin}${href}`;
}

/**
 * next/link that points site links (e.g. "/#about") at the main domain when
 * the page is shown on the Pulse host, so the nav and footer leave Pulse.
 */
export default function SiteLink({ href, ...props }: React.ComponentProps<typeof Link>) {
  const [target, setTarget] = useState(href);
  useEffect(() => {
    setTarget(typeof href === "string" ? toMainSite(href) : href);
  }, [href]);
  return <Link href={target} {...props} />;
}
