"use client";

import IrevCollationDashboard from "@/app/components/landing/results/IrevCollationDashboard";
import ResultsHero from "@/app/components/landing/results/ResultsHero";
import React from "react";

export default function ResultsPage() {
  return (
    <>
      <ResultsHero />
      <div className="mx-auto w-full min-w-0 max-w-[1120px] overflow-x-hidden px-5 sm:px-8 lg:max-w-[1180px] lg:px-10 xl:max-w-[1220px]">
        <main className="pb-16 pt-10 lg:pb-24 lg:pt-14">
          <IrevCollationDashboard />
        </main>
      </div>
    </>
  );
}
