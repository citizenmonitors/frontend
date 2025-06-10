import formatNumber from "@/app/utils/formatNumber";
import formatString from "@/app/utils/formatString";
import { Spin } from "antd";
import { ArrowDown, ArrowUp } from "iconsax-react";
import React, { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type BasicMonthComparisonGraphProps = {
  title: string;
  count: number;
  comparison: number;
  data: Array<{
    name: string;
    count: number;
  }>;
  loading?: boolean;
};

export default function BasicMonthComparisonGraph({
  title,
  count,
  comparison,
  data,
  loading,
}: BasicMonthComparisonGraphProps) {
  const negativeTrend = useMemo(() => comparison < 0, [comparison]);

  return (
    <article className="grid flex-1 gap-6 p-4 rounded-md md:p-6 md:bg-white ring-1 ring-gray-200 bg-gray-25 relative">
      <Spin
        className={`absolute top-4 right-5 ${
          loading ? "opacity-100" : "opacity-0"
        } transition-all duration-500`}
      />
      <header className="font-inter font-medium text-gray-700 leading-[1]">
        {title}
      </header>
      <div className="grid grid-cols-3">
        <div className="grid col-span-2 gap-4">
          <h3 className="font-semibold text-display-base text-gray-900 leading-[1]">
            {formatNumber.commas(count)}
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
              {Math.abs(Math.floor(comparison * 100))}%
            </span>{" "}
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>

        <div className="col-span-1 h-[50px] mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id={`${formatString.kebabCase(title.toLowerCase())}-fillGradient`}
                  x1="0"
                  y1="-1"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={negativeTrend ? "#F04438" : "#12B76A"}
                    stopOpacity={1}
                  />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="count"
                strokeWidth={1.5}
                stroke={negativeTrend ? "#F04438" : "#12B76A"}
                fill={`url(#${formatString.kebabCase(title.toLowerCase())}-fillGradient)`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </article>
  );
}
