"use client";

import React from "react";
import { ShieldTick } from "iconsax-react";
import formatNumber from "@/app/utils/formatNumber";
import { formatScorePercent } from "@/app/utils/validityIntegrityScore";

type IntegrityCoverageBarProps = {
  score: number;
  fullyCompliantResults: number;
  totalResultsPublished: number;
};

/** Prominent Data Validity banner — brand accent #05A39C */
export default function IntegrityCoverageBar({
  score,
  fullyCompliantResults,
  totalResultsPublished,
}: IntegrityCoverageBarProps) {
  return (
    <div className="w-full rounded-xl border-2 border-brand-500 bg-brand-50 px-4 py-4 shadow-sm md:px-5 md:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 grid h-10 w-10 shrink-0 place-content-center rounded-full bg-brand-500 text-white">
            <ShieldTick size={22} variant="Bold" />
          </span>
          <div className="min-w-0 space-y-1">
            <p className="text-base font-extrabold leading-snug text-brand-800 md:text-lg">
              Data Validity{" "}
              <span className="tabular-nums text-brand-500">
                {formatScorePercent(score)}
              </span>
            </p>
            <p className="text-sm font-bold leading-snug text-brand-800 md:text-[15px]">
              (Results compliant with the Electoral Act 2026):{" "}
              <span className="tabular-nums text-brand-900">
                {formatNumber.commas(fullyCompliantResults)}
              </span>{" "}
              of{" "}
              <span className="tabular-nums text-brand-900">
                {formatNumber.commas(totalResultsPublished)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
