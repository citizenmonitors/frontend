import PvcIssuesDisplay from "@/app/components/admin/pvc-issues/PvcIssuesDisplay";
import React from "react";

export default function PvcIssuesPage() {
  return (
    <div>
      <header className="mb-6 md:mb-7">
        <h2 className="font-league text-display-xs font-semibold leading-[1.1] text-gray-700 lg:text-display-base">
          PVC Issues
        </h2>
        <p className="mt-2 text-sm text-gray-500 lg:text-base">
          Review public PVC issue submissions, filter by location and issue type, and
          export records for legal and communications use
        </p>
      </header>

      <PvcIssuesDisplay />
    </div>
  );
}