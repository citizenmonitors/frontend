"use client";

import PulseFeed from "@/app/components/portal/pulse/PulseFeed";
import React from "react";

export default function PulsePage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[600px] overflow-x-hidden px-0 pb-8 pt-4 sm:px-4 sm:pt-6 md:max-w-[640px] md:pb-16 md:pt-8 lg:pb-20">
      <PulseFeed />
    </div>
  );
}
