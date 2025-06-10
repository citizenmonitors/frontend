import { useAppSelector } from "@/app/hooks/redux";
import formatNumber from "@/app/utils/formatNumber";
import { Spin } from "antd";
import { Activity } from "iconsax-react";
import React, { act, useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import CustomRechartsTooltip from "../../../shared/charts/CustomRechartsTooltip";

// rewrite to array of objects like { name: "verifiedObserverSubmissions", count: 4051149 }

export default function ActivityBoardData() {
  const activityState = useAppSelector((state) => state.activity);
  const activityBoard = activityState.activityBoard;
  const pieChartData = {
    "Observer Submissions": activityBoard.observerSubmissions,
    "Volunteer Submissions": activityBoard.volunteerSubmissions,
    "Approved Submissions": activityBoard.approvedObserverSubmissions,
    "Pending Approvals": activityBoard.pendingApprovals,
  };
  const colors = ["#05A39C", "#6EEDE7", "#CCFFFF", "#026B63"];
  const data = useMemo(() => {
    const slices = Object.entries(pieChartData).map(([name, count]) => ({ name, count }));
    return {
      slices,
      total: activityBoard.totalResultsSubmitted,
    };
  }, [pieChartData]);

  const diameter = { inner: 200, outer: 260 };

  return (
    <div className="py-4 border-b border-gray-200 md:p-4 lg:border-none">
      <header className="flex items-center gap-2 mb-4">
        <Activity variant="Bold" className="text-warning-600" size={20} />
        <h3 className="text-sm text-gray-700 md:text-lg">Activity Board</h3>
      </header>

      <div className="grid grid-cols-2">
        <div className="relative col-span-2 xl:col-span-1">
          <div
            className={`absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-all ${
              !data.total ? "opacity-0" : "opacity-100"
            }`}
          >
            <h3 className="font-bold text-center text-gray-700 text-display-sm leading-[1.1]">
              {formatNumber.commas(data.total)}
            </h3>
            <p className="text-sm text-center text-gray-500 truncate">
              total results submitted
            </p>
          </div>
          <ResponsiveContainer
            width="100%"
            height={diameter.outer + 25}
            className="relative"
          >
            <PieChart>
              <Pie
                data={data.slices}
                cx="50%"
                cy="50%"
                innerRadius={diameter.inner / 2}
                outerRadius={diameter.outer / 2}
                fill="#8884d8"
                dataKey="count"
                paddingAngle={5}
                cornerRadius={25}
              >
                {data.slices.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    style={{ outline: "none" }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="flex flex-col justify-center col-span-2 gap-1 mx-auto xl:gap-4 xl:col-span-1">
          {data.slices.map(({ name, count }, index) => (
            <li key={name} className="flex gap-3">
              <div
                className="w-[8px] xl:w-8 h-[6px] rounded-full mt-2"
                style={{ background: colors[index % colors.length] }}
              />
              <div className="flex gap-3 xl:gap-0 xl:flex-col">
                <p className="text-sm font-medium text-gray-500">{name}</p>
                <p className="text-sm text-gray-400">{formatNumber.commas(count)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
