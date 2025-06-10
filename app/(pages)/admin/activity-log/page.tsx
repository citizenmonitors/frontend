import ActivityLogDisplay from "@/app/components/admin/activity-log/ActivityLogDisplay";
import React from "react";

export default function ActivityLog() {
  return (
    <div>
     <header className="flex gap-3 md:items-center mb-1 md:mb-2">
        <h2 className="font-league text-display-xs text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Activity Log
        </h2>
      </header>
      <p className="text-sm text-gray-500 lg:text-base mb-7">
        Review actions performed by Admins and Super Admins.
      </p>

      <ActivityLogDisplay />
    </div>
  );
}
