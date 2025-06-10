import { LiveElection } from "@/app/redux/types";
import getElectionName from "@/app/utils/getElectionName";
import { SliderVertical } from "iconsax-react";
import React from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import ElectionReportsBarChart from "../../shared/charts/ElectionReportsBarChart";

const incidentColors: Record<string, string> = {
  "Thuggery and Violence": "#12B76A",
  "Lack of electoral materials": "#F04438",
  "Fraudulent electoral officers": "#4E5BA6",
  "Late commencement": "#FB6514",
  "Over voting": "#7A5AF8",
  Other: "#F63D68",
};

type LiveIncidentReportsGraphProps = {
  liveElection: LiveElection;
};
export default function LiveIncidentReportsGraph({
  liveElection,
}: LiveIncidentReportsGraphProps) {
  const allIncidentReports = liveElection.incidentReport!;
  
  const pieChartReducedData = allIncidentReports.chart.reduce(
    (acc: Record<string, number>, currReport) => {
      Object.entries(currReport).forEach(([incident, value]) => {
        if (typeof value === "number") {
          acc[incident] = (acc[incident] || 0) + value;
        }
      });
      return acc;
    },
    {} as Record<string, number>
  );
  const pieChartData = Object.entries(pieChartReducedData).map(([name, value]) => ({
    name,
    value,
    fill: incidentColors[name],
  }));
  
  const CHART_DIAMETER = 200;
  const RADIAN = Math.PI / 180;
  const renderCustomizedPieChartLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <React.Fragment>
        <text
          x={x + 8}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={12}
          opacity={percent < 0.05 ? 0 : 1}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </React.Fragment>
    );
  };

  return (
    <section className="bg-white rounded-md md:p-7 mb-8">
      <header className="flex justify-between items-center mb-10">
        <div className="flex gap-2 items-center">
          <SliderVertical variant="Bold" className="text-error-600 md:hidden" size={16} />
          <SliderVertical
            variant="Bold"
            className="text-error-600 hidden md:block"
            size={20}
          />
          <h3 className="text-sm md:text-base xl:text-lg text-gray-700">
            {getElectionName(liveElection.electionDetails)} Incident Reports
          </h3>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-4 xl:gap-10 mb-4 md:mb-10">
        <div className="col-span-12 xl:col-span-9">
          <ResponsiveContainer width={"100%"} height={255}>
            <ElectionReportsBarChart liveIncidentReport={liveElection.incidentReport} />
          </ResponsiveContainer>
        </div>
        <div className="col-span-12 xl:col-span-3">
          <ResponsiveContainer width="100%" height={CHART_DIAMETER}>
            <PieChart width={CHART_DIAMETER} height={CHART_DIAMETER}>
              <Tooltip />
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedPieChartLabel}
                outerRadius={CHART_DIAMETER / 2}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <ul
        id="reports-legend"
        className="flex gap-2 max-w-[520px] flex-wrap justify-center mx-auto"
      >
        {Object.entries(incidentColors).map(([incident, color]) => (
          <li key={incident} className="flex gap-1 items-center px-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-500">{incident}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
