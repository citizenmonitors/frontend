import formatNumber from "@/app/utils/formatNumber";
import { Select } from "antd";
import { SliderVertical } from "iconsax-react";
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LiveElection, LiveOverallSentimentAnalysis } from "@/app/redux/types";
import CustomRechartsTooltip from "../../../shared/charts/CustomRechartsTooltip";
import formatString from "@/app/utils/formatString";

type SentimentAnalysisBarChartProps = {
  title: string;
  liveElection: LiveElection;
  field: keyof LiveOverallSentimentAnalysis;
  options: Array<string>;
  colors: Array<string>;
};

export default function SentimentAnalysisBarChart({
  title,
  liveElection,
  field,
  options,
  colors,
}: SentimentAnalysisBarChartProps) {
  const overallSentimentAnalysis = liveElection.sentimentAnalysis!;
  const data = [{ ...overallSentimentAnalysis.chart![field], name: "" }];
  const ratingOptions = options.map((option, index) => ({
    name: option,
    fill: colors[index],
  }));

  function LiveSubmissionsLegend(props: any) {
    const { payload } = props;

    return (
      <div
        id="analysis-live-legend0"
        className="flex flex-col-reverse gap-3 md:flex-row justify-end items-center md:items-start font-light"
      >
        <ul className="flex gap-[20px] text-xs">
          {payload.map((entry: any, index: any) => (
            <li key={`item-${index}`} className="flex gap-1 items-center">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></span>
              {formatString.normalCase(entry.value)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <React.Fragment>
      <header className="flex justify-between items-center mb-10 gap-4">
        <div className="flex items-center gap-2">
          <SliderVertical
            variant="Bold"
            className="text-error-600 md:hidden min-w-[18px]"
            size={18}
          />
          <SliderVertical
            variant="Bold"
            className="text-error-600 hidden md:block min-w-5"
            size={20}
          />
          <h3 className="text-sm md:text-lg text-gray-700 leading-tight">{title}</h3>
        </div>
      </header>
      <ResponsiveContainer width={"100%"} height={230}>
        <BarChart data={data} margin={{ left: 0 }}>
          <CartesianGrid strokeDasharray="3 6" stroke="#D0D5DD" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={{ stroke: "#D0D5DD" }}
            tickLine={false}
            tick={{ fill: "#D0D5DD", fontSize: 10 }}
            tickMargin={8}
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
          <Legend content={LiveSubmissionsLegend} />
          {ratingOptions.map((option) => (
            <Bar
              key={option.name}
              dataKey={option.name}
              fill={option.fill}
              stroke="black"
              minPointSize={0.5}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
