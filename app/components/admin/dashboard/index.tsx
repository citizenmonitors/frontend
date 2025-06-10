import React, { useEffect } from "react";
import RegisteredUsers from "@/app/components/admin/dashboard/graphs/RegisteredUsers";
import Volunteers from "@/app/components/admin/dashboard/graphs/Volunteers";
import ActiveUsers from "@/app/components/admin/dashboard/graphs/ActiveUsers";
import ResultsUploaded from "@/app/components/admin/dashboard/graphs/ResultsUploaded";
import UserInfo from "@/app/components/admin/dashboard/graphs/UserInfo";
import AdminList from "@/app/components/admin/dashboard/graphs/AdminList";
import DailyTraffic from "@/app/components/admin/dashboard/graphs/DailyTraffic";
import { useAppDispatch } from "@/app/hooks/redux";
import { getGraphData } from "@/app/redux/admin-features/dashboardSlice";

export default function AdminGraphs() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getGraphData());
  }, []);
  
  return (
    <div className="grid gap-6 mt-6">
      <div
        id="first-row"
        className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3"
      >
        <RegisteredUsers />
        <Volunteers />
        <ActiveUsers />
      </div>

      <div id="second-row" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ResultsUploaded />
        <UserInfo />
      </div>

      <div
        id="third-row"
        className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3"
      >
        <AdminList />
        <DailyTraffic />
      </div>
    </div>
  );
}
