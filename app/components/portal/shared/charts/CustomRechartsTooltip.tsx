import formatString from "@/app/utils/formatString";
import React from "react";
import { TooltipProps } from "recharts";

export default function CustomRechartsTooltip(props: TooltipProps<any, any>) {
  const { active, payload, label } = props;

  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white text-gray-500 text-sm rounded min-w-[150px] max-w-[300px] p-1 ring-1 ring-gray-200">
        {label && (
          <p className="uppercase text-center text-[13px] font-medium font-league mb-1">
            {label}
          </p>
        )}
        <ul className="text-xs grid gap-1">
          {payload.map((pld: any) => (
            <li className="flex gap-1 items-center" key={pld.dataKey}>
              <div
                className="min-h-4 min-w-4 h-4 w-4 rounded-sm"
                style={{ backgroundColor: pld.fill }}
              />
              <div className="flex-1 flex justify-between gap-3">
                <span>{formatString.capitaliseFirst(pld.dataKey as string, true)}</span>{" "}
                <span className="text-gray-400">{pld.value}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}
