"use client";

import React from "react";

type ElectionDiscussionEmptyStateProps = {
  pollingUnitLabel?: string;
};

export default function ElectionDiscussionEmptyState({
  pollingUnitLabel,
}: ElectionDiscussionEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="mb-6 h-28 w-28 rounded-full bg-gray-100 grid place-content-center text-gray-300">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M9 9h6M9 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="font-league text-xl font-semibold text-gray-800 mb-2">
        No Discussion yet
      </h3>
      <p className="text-sm text-gray-500 max-w-sm">
        {pollingUnitLabel
          ? `You can be the first to drop your opinion with observers and volunteers at ${pollingUnitLabel}.`
          : "You can be the first to drop your opinion about this election."}
      </p>
    </div>
  );
}
