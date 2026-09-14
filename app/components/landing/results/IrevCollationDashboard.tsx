"use client";

import React, { useMemo, useState } from "react";
import moment from "moment";
import formatNumber from "@/app/utils/formatNumber";
import {
  getValidityIntegrityScore,
  mockIrevCollation,
} from "@/app/data/mockIrevCollation";
import { OSUN_ELECTION_SLUG } from "@/app/data/mockElectionDetail";
import { CollationMode } from "@/app/types/irevCollation";
import IntegrityCoverageBar from "./IntegrityCoverageBar";
import CollationModeToggle from "./CollationModeToggle";
import CollationSummaryStats from "./CollationSummaryStats";
import CollationCandidateResults from "./CollationCandidateResults";
import CollationVoteShare from "./CollationVoteShare";
import RecentElectionsCarousel from "./RecentElectionsCarousel";
import BrowseElectionsByType from "./BrowseElectionsByType";

type IrevCollationDashboardProps = {
  data?: typeof mockIrevCollation;
};

export default function IrevCollationDashboard({
  data = mockIrevCollation,
}: IrevCollationDashboardProps) {
  const [mode, setMode] = useState<CollationMode>("raw");
  const score = useMemo(() => getValidityIntegrityScore(data), [data]);
  const slice = mode === "raw" ? data.raw : data.verified;
  const updatedLabel = moment(data.updatedAt).format("D MMMM YYYY - hh:mmA");
  const detailHref = `/results/${OSUN_ELECTION_SLUG}`;

  return (
    <div className="grid min-w-0 w-full gap-10 overflow-x-hidden md:gap-14">
      <section id="explore-results" className="scroll-mt-24 grid gap-8 md:gap-10">
        <header className="mx-auto mb-2 max-w-2xl space-y-3 text-center md:mb-4 md:space-y-4">
          <h2 className="text-[28px] font-bold leading-tight tracking-tight text-gray-900 md:text-[40px]">
            Explore Election Result
          </h2>
          <p className="text-sm text-gray-500 md:text-base">
            View vote distribution, winning candidates, and party performance
            across Nigeria.
          </p>
          <p className="text-xs text-gray-400 md:text-sm">
            Out of every 100 results INEC has published, the score below shows
            how many meet Electoral Act 2026 requirements — checked
            automatically by Citizen Monitors.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-[#F7FAFC] p-4 shadow-sm md:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6 md:mb-10">
            <div className="min-w-0 space-y-3 md:space-y-4">
              <h3 className="text-base font-bold text-gray-900 md:text-lg">
                {data.electionName}
              </h3>
              <p
                className={`text-xs md:text-sm ${
                  mode === "raw" ? "text-warning-700" : "text-success-700"
                }`}
              >
                {mode === "raw" ? (
                  <>
                    <span className="font-semibold">
                      Unverified — Source: INEC IREV.
                    </span>{" "}
                    Showing all {formatNumber.commas(slice.resultsIncluded)}{" "}
                    published results.
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Fully compliant only.</span>{" "}
                    Showing {formatNumber.commas(slice.resultsIncluded)} results
                    that passed every automatic check.
                  </>
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
          />

          <div
            key={mode}
            className="mt-6 grid gap-5 md:mt-8 md:gap-6 animate-[collation-fade_0.35s_ease-out]"
          >
            <CollationSummaryStats totals={slice.totals} />

            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-5">
              <div className="lg:col-span-7 xl:col-span-8">
                <CollationCandidateResults
                  candidates={slice.candidates}
                  detailHref={detailHref}
                />
              </div>
              <div className="lg:col-span-5 xl:col-span-4">
                <CollationVoteShare candidates={slice.candidates} />
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
