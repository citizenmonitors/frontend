import NewsInsightsAdmin from "@/app/components/admin/news-insights/NewsInsightsAdmin";
import React from "react";

export default function NewsInsightsAdminPage() {
  return (
    <div>
      <header className="mb-6 md:mb-7">
        <h2 className="font-league text-display-xs font-semibold leading-[1.1] text-gray-700 lg:text-display-base">
          News &amp; Insight
        </h2>
        <p className="mt-2 text-sm text-gray-500 lg:text-base">
          Create articles for the News &amp; Insight feed on the website and app. Newsletters
          published as articles show up here too.
        </p>
      </header>

      <NewsInsightsAdmin />
    </div>
  );
}
