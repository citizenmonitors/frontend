import { LiveElection } from "@/app/redux/types";
import formatNumber from "@/app/utils/formatNumber";
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomRechartsTooltip from "./CustomRechartsTooltip";

const incidentColors: Record<string, string> = {
  "Thuggery and Violence": "#12B76A",
  "Lack of electoral materials": "#F04438",
  "Fraudulent electoral officers": "#4E5BA6",
  "Late commencement": "#FB6514",
  "Over voting": "#7A5AF8",
  Other: "#F63D68",
};

type ElectionReportsBarChartProps = {
  liveIncidentReport: LiveElection["incidentReport"];
};
export default function ElectionReportsBarChart({
  liveIncidentReport,
}: ElectionReportsBarChartProps) {
  const incidentReport = liveIncidentReport!;
  const groupRegion = Object.entries(incidentReport.chart[0]).find(
    ([_, value]) => typeof value === "string"
  )![0];

  const reportChartIncidents = useMemo(() => {
    // Get all incidents within the chart (since aggregate anaysis might have more)
    const incidents = new Set<string>();

    incidentReport.chart.forEach((incidentsPerRegion) => {
      Object.keys(incidentsPerRegion).forEach((incident) => {
        if (
          typeof incidentsPerRegion[incident] === "number" &&
          incidentsPerRegion[incident]
        )
          incidents.add(incident);
      });
    });
    return Array.from(incidents);
  }, [incidentReport.chart]);

  const isMobileView = window.innerWidth < 768;
  const MAX_REGIONS = isMobileView ? 3 : 4;

  return (
    <ResponsiveContainer width={"100%"} height={255}>
      <BarChart margin={{ left: 38 }} data={incidentReport.chart}>
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
            transform: "translate(3, 3)",
          }}
        />
        <YAxis
          orientation="right"
          axisLine={false}
          tickLine={false}
          width={24}
          tickFormatter={(value) => formatNumber.abbreviate(value)}
          tick={{ fill: "#D0D5DD", fontSize: 12, transform: "translate(0, -4)" }}
        />
        <Tooltip content={<CustomRechartsTooltip />} />
        {reportChartIncidents.map((incident) => (
          <Bar
            key={incident}
            dataKey={incident}
            fill={incidentColors[incident] || "#000"}
            stroke="black"
            minPointSize={0.5}
          />
        ))}
        {incidentReport.chart.length > MAX_REGIONS && (
          <Brush
            dataKey={groupRegion}
            height={24}
            endIndex={Math.min(incidentReport.chart.length, MAX_REGIONS)}
            stroke="#05A39C"
            fill="rgb(230 255 255 / 0.25)"
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
