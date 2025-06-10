import { ratingSelectOptions } from "@/app/data/form";
import {
  LiveElection,
  LiveOverallSentimentAnalysis,
  RatingOption,
} from "@/app/redux/types";
import formatString from "@/app/utils/formatString";
import { DocumentText } from "iconsax-react";
import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type SentimentAnalysisPieChartProps = {
  liveElection: LiveElection;
  field: keyof LiveOverallSentimentAnalysis;
  options: string[];
  colors: string[];
};
export default function SentimentAnalysisPieChart({
  liveElection,
  field,
  options,
  colors,
}: SentimentAnalysisPieChartProps) {
  const CHART_DIAMETER = 225;
  const sentimentAnalysis = liveElection.sentimentAnalysis!;

  const ratingOptions = options.map((option, index) => ({
    name: option,
    fill: colors[index],
  }));

  const pieChartData = useMemo(() => {
    const data = ratingOptions.map((option) => ({
      name: option.name,
      value: (sentimentAnalysis.chart![field] as any)[option.name],
      fill: option.fill,
    }));

    return data;
  }, [sentimentAnalysis, field]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
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
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={12}
          opacity={percent < 0.05 ? 0 : 1}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <text
          x={x}
          y={y + 15}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={12}
          opacity={percent < 0.05 ? 0 : 1}
        >
          {`${formatString.normalCase(name)}`}
        </text>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <hr className="mb-4 border-gray-100 md:hidden" />
      <header className="flex gap-2 items-center mb-4">
        <DocumentText variant="Bold" className="text-bluegray-500 md:hidden" size={16} />
        <DocumentText
          variant="Bold"
          className="text-bluegray-500 hidden md:block"
          size={20}
        />
        <h3 className="text-sm md:text-lg text-gray-700">Aggregate Analysis</h3>
      </header>
      <ResponsiveContainer width="100%" height={CHART_DIAMETER}>
        <PieChart width={CHART_DIAMETER} height={CHART_DIAMETER}>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
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
    </React.Fragment>
  );
}
