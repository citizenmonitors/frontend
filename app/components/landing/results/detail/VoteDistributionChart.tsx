"use client";

import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ElectionChartSeriesItem } from "@/app/types/irevCollation";
import formatNumber from "@/app/utils/formatNumber";

type VoteDistributionChartProps = {
  /** Dynamic series from results API / buildElectionChartsPayload */
  series: ElectionChartSeriesItem[];
};

type BarTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: ElectionChartSeriesItem }>;
};

function BarHoverTooltip({ active, payload }: BarTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-[0_8px_24px_rgba(16,24,40,0.12)]">
      <div className="flex items-center gap-2 text-sm text-gray-800">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: item.color }}
        />
        <span className="font-medium">{item.party}</span>
        <span className="font-semibold tabular-nums text-gray-900">
          {formatNumber.commas(item.votes)}
        </span>
      </div>
    </div>
  );
}

export default function VoteDistributionChart({
  series,
}: VoteDistributionChartProps) {
  const data = useMemo(
    () =>
      series.map((item) => ({
        ...item,
        fill: item.color,
      })),
    [series]
  );

  return (
    <section className="relative z-0 h-full overflow-visible rounded-xl border border-gray-200 bg-white p-4 md:p-5">
      <header className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 md:text-lg">
          Vote count distribution
        </h3>
        <p className="text-sm text-gray-500">See how vote is distributed</p>
      </header>

      <div className="relative z-10 h-[240px] w-full overflow-visible md:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#EAECF0" />
            <XAxis
              dataKey="party"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#667085", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#98A2B3", fontSize: 11 }}
              tickFormatter={(v) => formatNumber.abbreviate(v)}
              width={40}
            />
            <Tooltip
              cursor={{ fill: "rgba(5, 163, 156, 0.06)" }}
              content={<BarHoverTooltip />}
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ zIndex: 50, outline: "none", pointerEvents: "none" }}
            />
            <Bar dataKey="votes" radius={[6, 6, 0, 0]} maxBarSize={42}>
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-2 xs:grid-cols-2">
        {data.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 text-xs text-gray-600"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span className="truncate">
              {item.party} ({item.partyName})
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
