"use client";

import React from "react";
import { PulseLocationFilter } from "@/app/utils/pulseUtils";

type PulseLocationTabsProps = {
  value: PulseLocationFilter;
  onChange: (next: PulseLocationFilter) => void;
  userState?: string;
  userLga?: string;
  userWard?: string;
  userPollingUnit?: string;
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
  userLga,
  userWard,
  userPollingUnit,
}: PulseLocationTabsProps) {
  return (
    <div className="sticky top-[88px] z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md md:top-[72px] lg:top-[84px]">
      <div className="flex items-end overflow-x-auto [scrollbar-width:thin]">
        {TABS.map((tab) => {
          const active = value === tab.key;
          const subtitle =
            tab.key === "state"
              ? userState
              : tab.key === "lga"
                ? userLga
                : tab.key === "ward"
                  ? userWard
                  : tab.key === "pollingUnit"
                    ? userPollingUnit
                    : undefined;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`relative min-h-12 min-w-[3.75rem] flex-1 px-2 py-3 text-sm font-semibold transition-colors sm:min-w-0 sm:px-4 ${
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
