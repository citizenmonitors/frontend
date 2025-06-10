"use client";
import AdminGraphs from "@/app/components/admin/dashboard";
import Greeting from "@/app/components/portal/dashboard/Greeting";
import React from "react";

export default function AdminDashboard() {
  return (
    <div className="home-container">
      <Greeting />
      <p className="text-sm md:text-base">
        Welcome to the admin panel. The role of citizen monitors is to help you become
        sociopolitically active, engaged, and powerful.
      </p>
      <AdminGraphs />
    </div>
  );
}
