"use client";

import React, { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  CollationCandidate,
  ElectionChartSeriesItem,
} from "@/app/types/irevCollation";
import { buildElectionChartsPayload } from "@/app/utils/electionCharts";

type CollationVoteShareProps = {
  /** Prefer API-shaped series; candidates kept for listing-page callers */
  series?: ElectionChartSeriesItem[];
  candidates?: CollationCandidate[];
  subtitle?: string;
};

type ChartDatum = ElectionChartSeriesItem & { value: number };

function formatCandidateLabel(item: ElectionChartSeriesItem) {
  if (item.name.includes("Others")) return item.name;
  if (item.party && !item.name.includes(`(${item.party})`)) {
    return `${item.name} (${item.party})`;
  }
  return item.name;
}

export default function CollationVoteShare({
  series,
  candidates,
  subtitle = "All candidates",
}: CollationVoteShareProps) {
  const [hovered, setHovered] = useState<ChartDatum | null>(null);

  const resolved = useMemo(() => {
    if (series?.length) return series;
    if (candidates?.length) return buildElectionChartsPayload(candidates).series;
    return [];
  }, [series, candidates]);

  const { chartData, leaderShare } = useMemo(() => {
    return {
      chartData: resolved.map((c) => ({
        ...c,
        value: Math.max(c.votes, 1),
      })),
      leaderShare: resolved[0]?.share ?? 0,
    };
  }, [resolved]);

  return (
    <aside className="relative z-10 flex h-full flex-col overflow-visible rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
      <header className="mb-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          Share of Total Vote
        </h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </header>

      <div className="relative z-20 mx-auto my-4 w-full max-w-[280px] overflow-visible pt-14">
        {/* Hover label sits above the donut so the full name is never clipped */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex min-h-[48px] justify-center transition-opacity ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!hovered}
        >
          {hovered ? (
            <div className="w-full rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-[0_8px_24px_rgba(16,24,40,0.12)]">
              <div className="flex items-start gap-2 text-sm text-gray-800">
                <span
                  className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: hovered.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="break-words font-medium leading-snug">
                    {formatCandidateLabel(hovered)}
                  </p>
                  <p className="mt-0.5 font-semibold tabular-nums text-gray-900">
                    {hovered.share.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative aspect-square w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="62%"
                outerRadius="88%"
                paddingAngle={2}
                stroke="#fff"
                strokeWidth={2}
                startAngle={90}
                endAngle={-270}
                onMouseEnter={(_, index) => setHovered(chartData[index] ?? null)}
                onMouseLeave={() => setHovered(null)}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <p className="text-[34px] font-bold leading-none tabular-nums text-[#111827] md:text-[40px]">
              {(hovered?.share ?? leaderShare).toFixed(1)}%
            </p>
            <p className="mt-1 text-sm text-[#6B7280]">
              {hovered ? "Share" : "Leading"}
            </p>
          </div>
        </div>
      </div>

      <ul className="relative z-0 mt-2 grid gap-3.5">
        {resolved.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 text-sm"
          >
            <span className="flex min-w-0 items-start gap-2.5 text-[#374151]">
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="min-w-0 break-words leading-snug">
                {item.name.includes("Others")
                  ? item.name
                  : `${item.name} (${item.party})`}
              </span>
            </span>
            <span className="shrink-0 font-medium tabular-nums text-[#111827]">
              {item.share.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
