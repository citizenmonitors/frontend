import {
  BaseLiveElectionResult,
  GroupedLiveElectionResult,
  LiveElection,
} from "@/app/redux/types";
import formatNumber from "@/app/utils/formatNumber";
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Brush,
} from "recharts";
import CustomRechartsTooltip from "./CustomRechartsTooltip";
import formatString from "@/app/utils/formatString";

type ElectionSubmissionsBarChartProps = {
  liveResult: BaseLiveElectionResult;
  partyColors: Record<string, string>;
};
export default function ElectionSubmissionsBarChart({
  liveResult,
  partyColors,
}: ElectionSubmissionsBarChartProps) {
  const resultChartParties = useMemo(() => {
    if (!liveResult.chart) return [];

    // Get all parties within the chart (since aggregate anaysis might have more)
    const parties = new Set<string>();

    liveResult.chart.forEach((partyVotesPerRegion) => {
      Object.keys(partyVotesPerRegion).forEach((party) => {
        if (typeof partyVotesPerRegion[party] === "number") parties.add(party);
      });
    });
    return Array.from(parties);
  }, [liveResult.chart]);

  const singleBarGroupData = useMemo(() => {
    if (!liveResult.chart) return [];

    const data: Record<string, string | number> = {};
    liveResult.chart.forEach((partyVotesObj) => {
      const [party, votes] = Object.entries(partyVotesObj).find(
        ([_party, votes]) => typeof votes === "number"
      )!;
      data[party] = votes;
    });
    return [data];
  }, [liveResult]);

  if (!liveResult.chart)
    return (
      <p className="text-sm text-gray-500 text-center">
        Something went wrong on our end. <br />
        The chart could not be rendered.
      </p>
    );

  const groupRegion = Object.entries(liveResult.chart[0]).find(
    ([_, value]) => typeof value === "string"
  )![0];

  const isMobileView = window.innerWidth < 768;
  const MAX_REGIONS = isMobileView ? 10 : 10;

  function LiveSubmissionsLegend() {
    return (
      <div>
        <div className="flex flex-col-reverse gap-3 md:flex-row justify-between items-center md:items-start -ml-[38px] font-light">
          <ul className="flex flex-col text-xs">
            {liveResult.footer &&
              Object.entries(liveResult.footer).map(([name, value]) => (
                <li key={name}>
                  {formatString.kebabToNormalCase(name)}:{" "}
                  <span className="text-brand-500">{value}</span>
                </li>
              ))}
          </ul>

          <ul className="flex gap-1 text-xs max-w-[200px] flex-wrap justify-center md:justify-end">
            {resultChartParties.map((party) => (
              <li key={`item-${party}`} className="flex items-center gap-1 px-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: partyColors[party] }}
                />
                {party}
              </li>
            ))}
          </ul>
        </div>
        {liveResult.restriction && (
          <p className="text-xs text-center mt-1">
            Showing results in{" "}
            <span className="text-brand-500">
              {formatString.capitaliseFirst(liveResult.restriction.value)}{" "}
              {liveResult.restriction.name}
            </span>
          </p>
        )}
      </div>
    );
  }

  return (
    <ResponsiveContainer width={"100%"} height={255}>
      <BarChart data={singleBarGroupData} margin={{ left: 38 }}>
        <CartesianGrid strokeDasharray="3 6" stroke="#D0D5DD" vertical={false} />
        <XAxis
          dataKey={groupRegion}
          axisLine={{ stroke: "#D0D5DD" }}
          tickLine={false}
          tick={{ fill: "#D0D5DD", fontSize: 10 }}
          tickMargin={8}
          label={{
            value: groupRegion.toUpperCase(),
            position: "left",
            fill: "#667085",
            fontSize: 12,
            transform: "translate(6, 3)",
          }}
        />
        {/* {liveResult.chart.length > MAX_REGIONS && (
          <Brush
            dataKey={groupRegion}
            height={24}
            endIndex={Math.min(liveResult.chart.length, MAX_REGIONS)}
            stroke="#05A39C"
            fill="rgb(230 255 255 / 0.25)"
          />
        )} */}
        <Tooltip content={<CustomRechartsTooltip />} />
        <YAxis
          orientation="right"
          axisLine={false}
          tickLine={false}
          width={32}
          tickFormatter={(value) => formatNumber.abbreviate(value)}
          tick={{ fill: "#D0D5DD", fontSize: 12, transform: "translate(0, -4)" }}
        />
        {/* <Tooltip /> */}
        <Legend content={LiveSubmissionsLegend} />
        {resultChartParties.map((party) => (
          <Bar
            key={party}
            dataKey={party}
            fill={partyColors[party]}
            stroke={"black"}
            minPointSize={0.5}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
