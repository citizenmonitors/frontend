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
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {stats.map((stat) => (
        <article
          key={stat.key}
          className="rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm md:px-5 md:py-5"
        >
          <p className="mb-2 text-xs font-medium text-gray-500">
            {stat.label}
          </p>
          <p className="text-xl font-bold leading-none tracking-tight text-gray-900 tabular-nums md:text-2xl">
            {formatNumber.commas(totals[stat.key])}
          </p>
        </article>
      ))}
    </div>
  );
}
