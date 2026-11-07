import PulseReportsDisplay from "@/app/components/admin/pulse-reports/PulseReportsDisplay";
import React from "react";

export default function PulseReportsPage() {
  return (
    <div>
      <header className="mb-6 md:mb-7">
        <h2 className="font-league text-display-xs font-semibold leading-[1.1] text-gray-700 lg:text-display-base">
          Pulse Reports
        </h2>
        <p className="mt-2 text-sm text-gray-500 lg:text-base">
          Review posts and comments users reported on Pulse. Remove content that breaks
          the rules, or dismiss the reports.
        </p>
      </header>

      <PulseReportsDisplay />
    </div>
  );
}
