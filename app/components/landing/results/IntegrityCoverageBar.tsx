"use client";

import React from "react";
import { Timer1 } from "iconsax-react";
import formatNumber from "@/app/utils/formatNumber";
import { formatScorePercent } from "@/app/utils/validityIntegrityScore";

type IntegrityCoverageBarProps = {
  score: number;
  fullyCompliantResults: number;
  totalResultsPublished: number;
};

/** Slim single-tone banner — matches Dataphyte coverage bar style */
export default function IntegrityCoverageBar({
  score,
  fullyCompliantResults,
  totalResultsPublished,
}: IntegrityCoverageBarProps) {
  return (
    <div className="flex min-h-9 w-full flex-col gap-1.5 rounded-md bg-brand-50 px-3 py-2 sm:h-8 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-0 md:px-4">
      <div className="flex min-w-0 items-center gap-2 text-brand-800">
        <Timer1 size={14} className="shrink-0 text-brand-600" variant="Bold" />
        <p className="text-xs leading-snug sm:truncate">
          <span className="sm:hidden">Valid: </span>
          <span className="hidden sm:inline">Validity &amp; Integrity: </span>
          <span className="font-semibold tabular-nums">
            {formatNumber.commas(fullyCompliantResults)}
          </span>{" "}
          of{" "}
          <span className="font-semibold tabular-nums">
            {formatNumber.commas(totalResultsPublished)}
          </span>{" "}
          results
        </p>
      </div>
      <p className="shrink-0 self-end text-xs font-semibold tabular-nums text-brand-700 sm:self-auto">
        {formatScorePercent(score)}
      </p>
    </div>
  );
}
