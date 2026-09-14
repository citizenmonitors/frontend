"use client";

import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
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

type DonutTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: ElectionChartSeriesItem & { value: number } }>;
};

function DonutHoverTooltip({ active, payload }: DonutTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const label = item.name.includes("Others")
    ? item.name
    : item.name.length > 22
      ? `${item.name.slice(0, 20)}…`
      : item.name;

  return (
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-[0_8px_24px_rgba(16,24,40,0.12)]">
      <div className="flex items-center gap-2 text-sm text-gray-800">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: item.color }}
        />
        <span className="max-w-[140px] truncate font-medium">{label}</span>
        <span className="font-semibold tabular-nums text-gray-900">
          {item.share.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

export default function CollationVoteShare({
  series,
  candidates,
  subtitle = "All candidates",
}: CollationVoteShareProps) {
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
    <aside className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
      <header className="mb-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          Share of Total Vote
        </h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </header>

      <div className="relative mx-auto my-4 aspect-square w-full max-w-[280px]">
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
            >
              {chartData.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={<DonutHoverTooltip />}
              allowEscapeViewBox={{ x: true, y: true }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <p className="text-[34px] font-bold leading-none tabular-nums text-[#111827] md:text-[40px]">
            {leaderShare.toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-[#6B7280]">Leading</p>
        </div>
      </div>

      <ul className="mt-2 grid gap-3.5">
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
              <span className="leading-snug">
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
