import moment from "moment";
import React from "react";
import { useAppSelector } from "@/app/hooks/redux";
import BasicMonthComparisonGraph from "../../shared/BasicMonthComparisonGraph";
import { Button } from "antd";
import { ArrowRight2 } from "iconsax-react";

export default function RegisteredUsers() {
  const now = moment(Date.now());
  const { graphs, status } = useAppSelector((state) => state.adminUser);
  const graphData = graphs.registeredUsers;

  function handleDownloadDetails() {
    console.log("Download Details");
  }

  return (
    <div className="bg-white flex flex-col rounded-md overflow-hidden ring-1 ring-gray-200">
      <BasicMonthComparisonGraph
        title={"Registered Users"}
        count={graphData.count}
        comparison={(graphData.lastMonthComparison as number) / 100}
        data={graphData.data.map((day, index) => ({
          name: now
            .clone()
            .subtract(graphData.data.length - index, "days")
            .format("DD/MM"),
          count: day,
        }))}
        loading={status.fetchUsers === "pending"}
      />
      <div className="flex justify-end px-4 py-3 mt-0 border-t border-gray-200 md:py-4 md:px-6 actions rounded-md">
        <Button
          type="text"
          className="flex items-center gap-1 px-1 text-brand-500"
          onClick={handleDownloadDetails}
        >
          <span className="text-sm font-medium">View All</span> <ArrowRight2 size={20} />
        </Button>
      </div>
    </div>
  );
}
