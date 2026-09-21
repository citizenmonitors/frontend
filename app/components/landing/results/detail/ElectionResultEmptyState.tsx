"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft2, SearchStatus } from "iconsax-react";

type ElectionResultEmptyStateProps = {
  slug: string;
  title?: string;
  electionType?: string;
  location?: string;
};

export default function ElectionResultEmptyState({
  electionType,
  location,
}: ElectionResultEmptyStateProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[720px] flex-col items-center justify-center py-16 text-center lg:py-24">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <SearchStatus size={32} variant="Bold" />
      </span>

      {electionType ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
          {electionType}
          {location ? ` · ${location}` : ""}
        </p>
      ) : null}

      <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-display-xs">
        Election results unavailable
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500 md:text-base">
        Detailed results for this election are not available yet. Check back
        soon for published data.
      </p>

      <div className="mt-8 flex w-full justify-center">
        <Link
          href="/collation"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-800"
        >
          <ArrowLeft2 size={16} />
          Back to Collation
        </Link>
      </div>
    </div>
  );
}
