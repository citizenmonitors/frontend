import PvcIssuesForm from "@/app/components/landing/pvc-issues/PvcIssuesForm";
import React from "react";

export default function PvcReportPage() {
  return (
    <div className="container items-center justify-center py-8 md:py-12 lg:py-16 ">
      <header className="mb-8 md:mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 mb-2">
          Report a PVC Issue
        </p>
        <h1 className="font-league text-display-sm lg:text-display-md font-bold text-gray-800 leading-tight mb-4">
          Help Us Document PVC and Voter Registration Problems
        </h1>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          If you have been marked as unknown on the voters roll, unable to collect your
          PVC, or faced other registration failures, share your experience here. Your
          report supports Citizen Monitors&apos; engagement with INEC and legal advocacy
          for your right to vote.
        </p>
      </header>

      <div className="max-w-4xl rounded-2xl border border-gray-200 bg-white p-5 md:p-8 shadow-sm">
        <PvcIssuesForm />
      </div>
    </div>
  );
}
