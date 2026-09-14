import React from "react";
import formatNumber from "@/app/utils/formatNumber";
import { CollationTotals } from "@/app/types/irevCollation";

type CollationSummaryStatsProps = {
  totals: CollationTotals;
};

const stats: Array<{ key: keyof CollationTotals; label: string }> = [
  { key: "registeredVoters", label: "Registered Voters" },
  { key: "accreditedVoters", label: "Accredited Voters" },
  { key: "validVotes", label: "Valid Votes" },
  { key: "rejectedVotes", label: "Rejected Votes" },
];

export default function CollationSummaryStats({
  totals,
}: CollationSummaryStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4 lg:gap-4">
      {stats.map((stat) => (
        <article
          key={stat.key}
          className="min-w-0 rounded-xl border border-gray-100 bg-white px-3 py-3.5 shadow-sm sm:px-4 sm:py-4 md:px-5 md:py-5"
        >
          <p className="mb-1.5 text-[11px] font-medium leading-snug text-gray-500 sm:mb-2 sm:text-xs">
            {stat.label}
          </p>
          <p className="truncate text-base font-bold leading-none tracking-tight text-gray-900 tabular-nums sm:text-xl md:text-2xl">
            {formatNumber.commas(totals[stat.key])}
          </p>
        </article>
      ))}
    </div>
  );
}
