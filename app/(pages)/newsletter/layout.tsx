import { cookies } from "next/headers";
import { Metadata } from "next";
import React from "react";
import NewsletterLogin from "@/app/components/newsletter-portal/NewsletterLogin";
import NewsletterShell from "@/app/components/newsletter-portal/NewsletterShell";
import { NEWSLETTER_COOKIE, readNewsletterSession, newsletterConfigured } from "@/app/utils/newsletterAuth";

export const metadata: Metadata = {
  title: "Newsletter | Citizen Monitors",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewsletterLayout({ children }: { children: React.ReactNode }) {
  const username = await readNewsletterSession(cookies().get(NEWSLETTER_COOKIE)?.value);
  if (!username) return <NewsletterLogin configured={newsletterConfigured()} />;
  return <NewsletterShell username={username}>{children}</NewsletterShell>;
}
