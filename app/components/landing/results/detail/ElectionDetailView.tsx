"use client";

import React, { useMemo, useState } from "react";
import { DocumentText1 } from "iconsax-react";
import { getValidityIntegrityScore } from "@/app/data/mockIrevCollation";
import {
  getElectionDetailBySlug,
  getElectionListingMetaBySlug,
  getYearForSlug,
} from "@/app/data/mockElectionDetail";
import ElectionResultEmptyState from "./ElectionResultEmptyState";
import ResultLocationFilters from "./ResultLocationFilters";
import { CollationMode, ResultViewMode } from "@/app/types/irevCollation";
import IntegrityCoverageBar from "../IntegrityCoverageBar";
import CollationSummaryStats from "../CollationSummaryStats";
import CollationModeToggle from "../CollationModeToggle";
import CollationVoteShare from "../CollationVoteShare";
import CandidateLeaderboard from "./CandidateLeaderboard";
import AreaResultsTable from "./AreaResultsTable";
import ElectionMapCard from "./ElectionMapCard";
import VoteDistributionChart from "./VoteDistributionChart";
import { buildElectionChartsPayload } from "@/app/utils/electionCharts";

type ElectionDetailViewProps = {
  slug: string;
};

const viewModes: Array<{ key: ResultViewMode; label: string }> = [
  { key: "candidates", label: "Candidates" },
  { key: "lgas", label: "LGAs" },
  { key: "ras", label: "RAs" },
  { key: "pus", label: "PUs" },
];

export default function ElectionDetailView({ slug }: ElectionDetailViewProps) {
  const detail = getElectionDetailBySlug(slug);
  const [viewMode, setViewMode] = useState<ResultViewMode>("candidates");
  const [mode, setMode] = useState<CollationMode>("raw");

  const score = useMemo(
    () => (detail ? getValidityIntegrityScore(detail.election) : 0),
    [detail]
  );

  const charts = useMemo(
    () =>
      detail
        ? buildElectionChartsPayload(
            detail.chartCandidates,
            detail.election.updatedAt
          )
        : { updatedAt: "", series: [] },
    [detail]
  );

  if (!detail) {
    const meta = getElectionListingMetaBySlug(slug);
    const year = getYearForSlug(slug);
    return (
      <div className="min-h-screen bg-gray-50/80 pb-16">
        <div className="mx-auto w-full min-w-0 max-w-[1120px] px-5 pt-4 sm:px-8 md:pt-6 lg:max-w-[1180px] lg:px-10 xl:max-w-[1220px]">
          <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="break-words text-xl font-bold leading-tight text-gray-900 md:text-display-xs">
                {meta.title}
              </h1>
              {meta.electionType ? (
                <p className="mt-1 text-sm text-gray-500">
                  {meta.electionType}
                  {meta.location ? ` · ${meta.location}` : ""}
                </p>
              ) : null}
            </div>
            {meta.location && year ? (
              <ResultLocationFilters location={meta.location} year={year} />
            ) : null}
          </header>
          <ElectionResultEmptyState
            slug={slug}
            title={meta.title}
            electionType={meta.electionType}
            location={meta.location}
          />
        </div>
      </div>
    );
  }

  const { election } = detail;
  const slice = mode === "raw" ? election.raw : election.verified;

  return (
    <div className="min-h-screen bg-gray-50/80 pb-16">
      <div className="mx-auto w-full min-w-0 max-w-[1120px] px-5 pt-4 sm:px-8 md:pt-6 lg:max-w-[1180px] lg:px-10 xl:max-w-[1220px]">
        <header className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 flex-1 gap-3">
            <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <DocumentText1 size={22} variant="Bold" />
            </span>
            <div className="min-w-0">
              <h1 className="break-words text-xl font-bold leading-tight text-gray-900 md:text-display-xs">
                {election.electionName}
              </h1>
              <p className="mt-1 text-sm text-gray-500">{detail.description}</p>
            </div>
          </div>
          <ResultLocationFilters
            location={detail.location}
            year={detail.year}
          />
        </header>

        <div className="mb-6 border-b border-gray-200 md:mb-8">
          <div className="relative inline-block px-4 py-3 text-sm font-semibold text-brand-600 md:px-5">
            Result
            <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-brand-500" />
          </div>
        </div>

        <div className="grid gap-5 md:gap-6">
          <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-bold text-gray-900 md:text-xl">
                Vote Result
              </h2>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                <CollationModeToggle mode={mode} onChange={setMode} />
                <div className="grid w-full grid-cols-4 rounded-lg bg-gray-100 p-1 sm:inline-flex sm:w-auto">
                  {viewModes.map((item) => {
                    const active = viewMode === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setViewMode(item.key)}
                        className={`min-h-11 rounded-md px-1.5 py-2 text-[11px] font-medium transition-colors sm:px-3 sm:text-sm ${
                          active
                            ? "bg-white text-brand-700 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:gap-8">
              <IntegrityCoverageBar
                score={score}
                fullyCompliantResults={election.fullyCompliantResults}
                totalResultsPublished={election.totalResultsPublished}
              />
              <CollationSummaryStats totals={slice.totals} />

              {viewMode === "candidates" ? (
                <CandidateLeaderboard rows={detail.leaderboard} />
              ) : (
                <AreaResultsTable
                  mode={viewMode}
                  rows={
                    viewMode === "lgas"
                      ? detail.lgas
                      : viewMode === "ras"
                        ? detail.ras
                        : detail.pus
                  }
                />
              )}
            </div>
          </section>

          <ElectionMapCard
            regions={detail.mapRegions}
            legend={detail.mapLegend}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
            <VoteDistributionChart series={charts.series} />
            <CollationVoteShare
              series={charts.series}
              subtitle="All candidates across nation"
            />
          </div>

          <p className="text-center text-sm text-error-600">
            Disclaimer: Live results update continuously. Data reflects results
            obtained from INEC and is not a final declaration.
          </p>
        </div>
      </div>
    </div>
  );
}
