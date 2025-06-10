"use client";
import useLiveDate from "@/app/hooks/useLiveDate";
import moment from "moment";
import React from "react";

const DashboardTime = () => {
  const date = useLiveDate();
  return (
    <div className="dashboard-time hidden md:flex gap-2 text-gray-500">
      <time className="font-light">{moment(date).format(`LL`)}</time>
      <span className="text-gray-900">•</span>
      <time className="font-light">{moment(date).format(`LT`)}</time>
    </div>
  );
};

export default DashboardTime;
