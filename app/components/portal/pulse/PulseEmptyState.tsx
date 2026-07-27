"use client";

import React from "react";

export default function PulseEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">

      <h3 className="font-league text-xl font-semibold text-gray-800 mb-2">
        No Discussion yet
      </h3>
      <p className="text-sm text-gray-500 max-w-xs">
        You will see discussions going on in your ward here.
      </p>
    </div>
  );
}
