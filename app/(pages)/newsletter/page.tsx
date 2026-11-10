import NewsletterCompose from "@/app/components/admin/newsletter/NewsletterCompose";
import React from "react";

export default function NewsletterPortalPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-league text-display-xs font-semibold leading-[1.1] text-gray-700 lg:text-display-sm">
          Newsletter
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Paste a draft, preview it as an email and as a News &amp; Insight article, then send a
          test or the live newsletter.
        </p>
      </header>
      <NewsletterCompose />
    </div>
  );
}
