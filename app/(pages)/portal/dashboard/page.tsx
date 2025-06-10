"use client";
import React from "react";
import VerifySection from "@/app/components/portal/dashboard/VerifySection";
import Greeting from "@/app/components/portal/dashboard/Greeting";
import Graphs from "@/app/components/portal/dashboard/graphs/Graphs";
import Disclaimer from "@/app/components/shared/Disclaimer";

export default function PortalDashboard() {
  return (
    <div className="home-container">
      <Greeting />
      <p className="mb-4 text-sm md:text-base">
        The role of Citizen Monitors is to help you become electorally powerful,
        politically active and collectively influential.
      </p>
      <Graphs />
      <VerifySection />
      <Disclaimer variant="dashboard" />
    </div>
  );
}
