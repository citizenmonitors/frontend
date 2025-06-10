import Logo from "@/app/components/shared/svg/Logo";
import { Spin } from "antd";
import React from "react";

const DashboardLoading = () => {
  return (
    <main className="dashboard-loading w-screen h-screen grid place-items-center">
      <div className="loading-indicator flex flex-col gap-4">
        <Logo size={68} />
        <div className="h-[32px] grid place-items-center">
          <Spin size="large" />
        </div>
      </div>
    </main>
  );
};

export default DashboardLoading;
