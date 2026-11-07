import NewsletterCompose from "@/app/components/admin/newsletter/NewsletterCompose";
import React from "react";

export default function NewsletterPage() {
  return (
    <div>
      <header className="mb-6 md:mb-7">
        <h2 className="font-league text-display-xs font-semibold leading-[1.1] text-gray-700 lg:text-display-base">
          Newsletter
        </h2>
        <p className="mt-2 text-sm text-gray-500 lg:text-base">
          Paste a draft, preview it as an email and as a News &amp; Insight article, then
          send a test or the live newsletter.
        </p>
      </header>

      <NewsletterCompose />
    </div>
  );
}
