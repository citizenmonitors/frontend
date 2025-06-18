"use client";
import React, { useEffect, useState } from "react";
import insights from "@/app/data/insights/index";
import InsightCard from "@/app/components/landing/insights/InsightCard";
import { Insight } from "@/app/data/insights/types";

export default function Insights() {
  const [currentInsights, setCurrentInsights] = useState<Array<Insight>>([]);

  // Initialize the insights state with the imported insights
  // This will run once when the component mounts
  useEffect(() => {
    setCurrentInsights(insights);
  }, []);

  return (
    <div className="container">
      <header className="text-display-sm lg:text-display-lg font-league text-center leading-tight tracking-tight font-bold mb-5 mt-3 lg:mt-[55px] lg:mb-10 lg:text-left">
        <h1 className="text-brand-500">INSIGHTS:</h1>{" "}
        <h2 className="leading-[0.94] text-gray-700">
          Discover the Most Compelling Insights on Elections right here.
        </h2>
      </header>

      <div className="grid place-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-24 xxl:gap-32 mb-16 lg:mb-32">
        {currentInsights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}
