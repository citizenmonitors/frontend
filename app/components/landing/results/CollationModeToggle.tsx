"use client";

import React from "react";
import { CollationMode } from "@/app/types/irevCollation";

type CollationModeToggleProps = {
  mode: CollationMode;
  onChange: (mode: CollationMode) => void;
};

const modes: Array<{ value: CollationMode; label: string }> = [
  { value: "raw", label: "IREV" },
  { value: "verified", label: "Verified" },
];

export default function CollationModeToggle({
  mode,
  onChange,
}: CollationModeToggleProps) {
  return (
    <div
      className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm"
      role="tablist"
      aria-label="Collation view"
    >
      {modes.map((item) => {
        const active = mode === item.value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={`min-h-11 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? "bg-brand-500 text-white"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
