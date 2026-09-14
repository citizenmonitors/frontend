"use client";

import PulseFeed from "@/app/components/portal/pulse/PulseFeed";
import React from "react";

export default function PulsePage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[720px] overflow-x-hidden px-4 pb-8 pt-6 sm:px-6 sm:pt-8 md:max-w-[800px] md:px-8 md:pb-16 md:pt-10 lg:pb-24">
      <PulseFeed />
    </div>
  );
}
