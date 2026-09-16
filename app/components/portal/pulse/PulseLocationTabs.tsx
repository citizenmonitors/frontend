"use client";

import React from "react";
import { PulseLocationFilter } from "@/app/utils/pulseUtils";

type PulseLocationTabsProps = {
  value: PulseLocationFilter;
  onChange: (next: PulseLocationFilter) => void;
  userState?: string;
};

const TABS: Array<{ key: PulseLocationFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "state", label: "State" },
  { key: "lga", label: "LGA" },
  { key: "ward", label: "Ward" },
  { key: "pollingUnit", label: "Polling Unit" },
];

export default function PulseLocationTabs({
  value,
  onChange,
  userState,
}: PulseLocationTabsProps) {
  return (
    <div className="sticky top-[72px] z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md sm:top-[76px] md:top-[68px]">
      <div className="flex items-end overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => {
          const active = value === tab.key;
          const subtitle =
            tab.key === "state" && userState ? userState : undefined;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`relative min-h-12 min-w-[4.5rem] flex-1 px-3 py-3 text-sm font-semibold transition-colors sm:min-w-0 sm:px-4 ${
                active
                  ? "text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              {subtitle ? (
                <span className="mb-0.5 block truncate text-[10px] font-medium text-brand-600">
                  {subtitle}
                </span>
              ) : null}
              <span className="block">{tab.label}</span>
              {active ? (
                <span className="absolute inset-x-6 bottom-0 h-1 rounded-full bg-brand-500" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
