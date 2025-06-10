import moment from "moment";
import React from "react";
import BasicMonthComparisonGraph from "../../shared/BasicMonthComparisonGraph";
import { useAppSelector } from "@/app/hooks/redux";

export default function RegisteredUsers() {
  const now = moment(Date.now());
  const { graphs, status } = useAppSelector((state) => state.adminDashboard);
  const graphData = graphs.registeredUsers;

  return (
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
      loading={status.fetchGraphData === "pending"}
    />
  );
}
