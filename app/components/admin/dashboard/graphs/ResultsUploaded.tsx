import { useAppSelector } from "@/app/hooks/redux";
import formatNumber from "@/app/utils/formatNumber";
import { Button, Spin } from "antd";
import { ArrowDown, ArrowRight2, ArrowUp } from "iconsax-react";
import moment from "moment";
import React, { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export default function ResultsUploaded() {
  const now = moment(Date.now());
  const { graphs, status } = useAppSelector((state) => state.adminDashboard);
  const graphData = graphs.resultsUploaded;

  const data = {
    resultsUploadedCount: graphData.count,
    lastMonthComparison: (graphData.lastMonthComparison as number) / 100,
    // past 12 days
    dailyUploads: graphData.data.map((day, index) => ({
      name: now
        .clone()
        .subtract(graphData.data.length - index, "days")
        .format("MMM Do"),
      results: day,
    })),
  };
  const negativeTrend = useMemo(() => data.lastMonthComparison < 0, [data]);
  function handleViewResults() {
    console.log("View Results");
  }

  return (
    <article className="grid rounded-md h-full md:bg-white ring-1 ring-gray-200 bg-gray-25">
      <section className="grid gap-6 p-4 md:p-6 relative">
        <Spin
          className={`absolute top-4 right-5 ${
            status.fetchGraphData === "pending" ? "opacity-100" : "opacity-0"
          } transition-all duration-500`}
        />
        <header className="font-inter font-medium text-gray-700 leading-[1]">
          Results Uploaded
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="grid col-span-1 gap-2 md:gap-4">
            <h3 className="font-semibold text-display-base text-gray-900 leading-[1]">
              {formatNumber.commas(data.resultsUploadedCount)}
            </h3>
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
                {Math.abs(Math.floor(data.lastMonthComparison * 100))}%
              </span>{" "}
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>

          <div className="col-span-1 mb-2 md:mb-0 -order-1 md:order-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyUploads}>
                <Tooltip />
                <XAxis dataKey="name" height={0} />
                <Line
                  type="monotone"
                  dataKey="results"
                  strokeWidth={2}
                  stroke={"#05A39C"}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
      <div className="flex justify-end px-4 py-3 mt-0 border-t border-gray-200 md:py-4 md:px-6 actions">
        <Button
          type="text"
          className="flex items-center gap-1 px-1 text-brand-500"
          onClick={handleViewResults}
        >
          <span className="text-sm font-medium">View All</span> <ArrowRight2 size={20} />
        </Button>
      </div>
    </article>
  );
}
