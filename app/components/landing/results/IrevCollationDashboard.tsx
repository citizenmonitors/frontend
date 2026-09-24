"use client";

import React, { useMemo, useState } from "react";
import moment from "moment";
import formatNumber from "@/app/utils/formatNumber";
import {
  getValidityIntegrityScore,
} from "@/app/data/mockIrevCollation";
import { OSUN_ELECTION_SLUG } from "@/app/data/mockElectionDetail";
import { mockIrevCollation } from "@/app/data/mockIrevCollation";
import { CollationMode, IrevCollationData } from "@/app/types/irevCollation";
import IntegrityCoverageBar from "./IntegrityCoverageBar";
import CollationModeToggle from "./CollationModeToggle";
import CollationSummaryStats from "./CollationSummaryStats";
import CollationCandidateResults from "./CollationCandidateResults";
import CollationVoteShare from "./CollationVoteShare";
import RecentElectionsCarousel from "./RecentElectionsCarousel";
import BrowseElectionsByType from "./BrowseElectionsByType";

type IrevCollationDashboardProps = {
  data?: IrevCollationData;
};

export default function IrevCollationDashboard({
  data = mockIrevCollation,
}: IrevCollationDashboardProps) {
  const [mode, setMode] = useState<CollationMode>("raw");
  const score = useMemo(() => getValidityIntegrityScore(data), [data]);
  const slice = mode === "raw" ? data.raw : data.verified;
  const updatedLabel = moment(data.updatedAt).format("D MMMM YYYY - hh:mmA");
  const detailHref = `/collation/${OSUN_ELECTION_SLUG}`;

  return (
    <div className="grid min-w-0 w-full gap-10 overflow-x-hidden md:gap-14">
      <section id="explore-collation" className="scroll-mt-24 grid gap-8 md:gap-10">
        <div className="overflow-x-hidden overflow-y-visible rounded-2xl border border-gray-200/80 bg-[#F7FAFC] p-4 shadow-sm md:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6 md:mb-10">
            <div className="min-w-0 space-y-3 md:space-y-4">
              <h3 className="text-base font-bold text-gray-900 md:text-lg">
                {data.electionName}
              </h3>
              <p
                className={`text-sm leading-snug md:text-base ${
                  mode === "raw" ? "text-error-600" : "text-success-700"
                }`}
              >
                {mode === "raw" ? (
                  <span className="font-bold">
                    Showing a collation of raw collated data from the INEC IREV
                    Portal
                  </span>
                ) : (
                  <span className="font-bold">
                    Showing {formatNumber.commas(slice.resultsIncluded)} results
                    that has been verified to be compliant with the Electoral
                    Act 2026
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end sm:gap-4">
              <p className="text-xs text-gray-500 md:text-sm">
                Updated: {updatedLabel}
              </p>
              <CollationModeToggle mode={mode} onChange={setMode} />
            </div>
          </div>

          <IntegrityCoverageBar
            score={score}
            fullyCompliantResults={data.fullyCompliantResults}
            totalResultsPublished={data.totalResultsPublished}
            title="Data Validity"
            subtitle="(Results compliant with the Electoral Act 2026)"
          />

          <div
            key={mode}
            className="mt-6 grid gap-5 md:mt-8 md:gap-6 animate-[collation-fade_0.35s_ease-out]"
          >
            <CollationSummaryStats totals={slice.totals} />

            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-5">
              <div className="relative z-0 min-w-0 lg:col-span-7 xl:col-span-8">
                <CollationCandidateResults
                  candidates={slice.candidates}
                  detailHref={detailHref}
                />
              </div>
              <div className="relative z-10 min-w-0 lg:col-span-5 xl:col-span-4">
                <CollationVoteShare
                  candidates={slice.candidates}
                  subtitle="All candidates"
                />
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-error-600">
          Disclaimer: Live results update continuously. Data reflects results
          obtained from INEC and is not a final declaration.
        </p>
      </section>

      <RecentElectionsCarousel />
      <BrowseElectionsByType />
    </div>
  );
}
