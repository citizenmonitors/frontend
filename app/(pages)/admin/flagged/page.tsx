import FlaggedUploadsDisplay from "@/app/components/admin/flagged/FlaggedUploadsDisplay";
import React from "react";

export default function FlaggedUploads() {
  return (
    <div>
      <header className="flex gap-3 md:items-center mb-1 md:mb-2">
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Flagged Results
        </h2>
      </header>
      <p className="text-sm text-gray-500 lg:text-base mb-6 md:mb-7">
        Review and take action on flagged uploads.
      </p>

      <FlaggedUploadsDisplay />
    </div>
  );
}
