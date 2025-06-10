import { useAppSelector } from "@/app/hooks/redux";
import formatNumber from "@/app/utils/formatNumber";
import { Spin } from "antd";
import { ArrowDown, ArrowUp } from "iconsax-react";
import moment from "moment";
import React, { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export default function DailyTraffic() {
  const now = moment(Date.now());
  const { graphs, status } = useAppSelector((state) => state.adminDashboard);
  const graphData = graphs.dailyTraffic;

  const data = {
    visitorCount: graphData.count,
    lastDayComparison: (graphData.lastMonthComparison as number) / 100,
    // past 7 days
    dailyVisitors: graphData.data.map((day, index) => ({
      name: now
        .clone()
        .subtract(graphData.data.length - index, "days")
        .format("dddd")
        .slice(0, 3),
      visits: day,
    })),
  };
  const negativeTrend = useMemo(() => data.lastDayComparison < 0, [data]);

  return (
    <article className="grid p-4 rounded-md md:bg-white md:p-6 ring-1 ring-gray-200 bg-gray-25 relative">
      
      <header className="font-inter text-gray-400 leading-[1] text-sm h-fit mb-1">
        Daily Traffic
      </header>

      <div className="flex justify-between traffic-info h-fit">
        <div id="traffic-visitor-count" className="flex gap-[.25ch] items-end">
          <h3 className="text-display-sm font-bold text-gray-900 leading-[1]">
            {formatNumber.commas(data.visitorCount)}
          </h3>
          <span className="text-sm text-gray-400 leading-[1]">Visitors</span>
        </div>

        <div className="text-sm font-medium flex gap-[.5ch] items-center">
          <span
            className={`flex gap-[.5ch] items-center ${
              negativeTrend ? "text-error-500" : "text-success-500"
            }`}
          >
            {negativeTrend ? (
              <ArrowDown size={16} variant="Outline" />
            ) : (
              <ArrowUp size={16} variant="Outline" />
            )}{" "}
            {Math.abs(Math.floor(data.lastDayComparison * 100))}%
          </span>
        </div>
      </div>

      <div className="mt-auto">
        <ResponsiveContainer width="100%" height={135}>
          <BarChart
            data={data.dailyVisitors}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id={`daily-traffic-fillGradient`}
                x1="0"
                y1="-1"
                x2="0"
                y2="1"
              >
                <stop offset="40%" stopColor={"#038580"} stopOpacity={1} />
                <stop offset="100%" stopColor="#6EEDE7" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: 12, color: "#667085" }}
              axisLine={false}
              height={20}
            />
            <Tooltip />
            <Bar
              dataKey="visits"
              fill="url(#daily-traffic-fillGradient)"
              radius={[100, 100, 0, 0]}
              barSize={15}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
