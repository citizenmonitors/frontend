import NewsInsightsAdmin from "@/app/components/admin/news-insights/NewsInsightsAdmin";
import React from "react";

export default function NewsletterNewsInsightsPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-league text-display-xs font-semibold leading-[1.1] text-gray-700 lg:text-display-sm">
          News &amp; Insight
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Create articles for the News &amp; Insight feed on the website and app.
        </p>
      </header>
      <NewsInsightsAdmin />
    </div>
  );
}
