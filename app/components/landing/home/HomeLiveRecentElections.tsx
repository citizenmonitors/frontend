"use client";

import React from "react";
import Link from "next/link";
import RecentElectionsCarousel from "@/app/components/landing/results/RecentElectionsCarousel";

/** Homepage snippet of live + recent elections, placed above About Us */
export default function HomeLiveRecentElections() {
  return (
    <section
      id="live-elections"
      className="border-t border-gray-100 bg-white py-12 md:py-16"
    >
      <div className="container mx-auto w-full min-w-0 max-w-[1120px] overflow-x-hidden px-5 sm:px-8 lg:max-w-[1180px] lg:px-10 xl:max-w-[1220px]">
        <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">
              Overview
            </p>
            <h2 className="font-league text-[28px] font-bold leading-tight tracking-tight text-gray-900 md:text-[36px]">
              Live and Recent Elections
            </h2>
            <p className="text-sm text-gray-500 md:text-base">
              A snapshot of elections you can explore right now — results,
              candidates, and updates across Nigeria.
            </p>
          </div>
          <Link
            href="/results"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border-2 border-error-600 bg-error-50 px-4 text-sm font-bold text-error-600 transition-colors hover:bg-error-100"
          >
            View all Result
          </Link>
        </div>

        <RecentElectionsCarousel hideHeader variant="dark" />
      </div>
    </section>
  );
}
