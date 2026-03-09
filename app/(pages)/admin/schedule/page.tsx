"use client";

import React from "react";
import AdminScheduleView from "@/app/components/admin/schedule/AdminScheduleView";
import Greeting from "@/app/components/portal/dashboard/Greeting";

export default function AdminSchedulePage() {
  return (
    <div className="home-container">
      <Greeting />
      <p className="text-sm md:text-base text-gray-600 mb-6">
        Speaker schedule for the 72-Hour X Space. Export CSV or move bookings as needed.
      </p>
      <AdminScheduleView />
    </div>
  );
}
