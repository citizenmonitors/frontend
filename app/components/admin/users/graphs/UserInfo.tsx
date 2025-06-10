import { useAppSelector } from "@/app/hooks/redux";
import formatString from "@/app/utils/formatString";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function UserInfo() {
  const { graphs, status } = useAppSelector((state) => state.adminUser);
  const graphData = graphs.userInfo;

  return (
    <article className="flex flex-col gap-6 p-4 rounded-md md:bg-white md:p-6 ring-1 ring-gray-200 bg-gray-25">
      <header className="font-inter font-medium text-gray-700 leading-[1]">
        User Info <span className="text-gray-500">(Gender & User Type)</span>
      </header>
      <div className="grid grid-cols-2 gap-6 my-auto">
        <UserInfoBarChart data={graphData.gender} />
        <UserInfoBarChart data={graphData.roles} />
      </div>
    </article>
  );
}

type UserInfoBarChartProps = {
  data: Array<{
    name: string;
    count: number;
  }>;
};

function UserInfoBarChart({ data }: UserInfoBarChartProps) {
  const colors = ["#038580", "#6EEDE7", "#026B63"];
  return (
    <div className="flex flex-col gap-2">
      {/* Bar Chart */}
      <div>
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  style={{ outline: "none" }}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={{ color: "#667085", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-col items-center justify-center w-full col-span-1 gap-0 xl:gap-4 xl:flex-row">
        {data.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <div
              className="w-2 h-2 min-w-0 rounded-full"
              style={{ backgroundColor: colors[index % data.length] }}
            />
            <span className="text-sm font-light text-gray-600">
              {formatString.normalCase(item.name)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
