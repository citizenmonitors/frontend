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
import {
  AreaResultRow,
  CollationMode,
  ElectionDetailTab,
  ResultViewMode,
} from "@/app/types/irevCollation";
import IntegrityCoverageBar from "../IntegrityCoverageBar";
import CollationSummaryStats from "../CollationSummaryStats";
import CollationModeToggle from "../CollationModeToggle";
import CollationVoteShare from "../CollationVoteShare";
import CandidateLeaderboard from "./CandidateLeaderboard";
import AreaResultsTable from "./AreaResultsTable";
import ElectionMapCard from "./ElectionMapCard";
import VoteDistributionChart from "./VoteDistributionChart";
import IncidentsTabPanel from "./IncidentsTabPanel";
import LocationTraceModal from "./LocationTraceModal";
import PollingUnitResultSheetModal from "./PollingUnitResultSheetModal";
import { buildElectionChartsPayload } from "@/app/utils/electionCharts";

type ElectionDetailViewProps = {
  slug: string;
};

const detailTabs: Array<{ key: ElectionDetailTab; label: string }> = [
  { key: "result", label: "Result" },
  { key: "post-incident", label: "Post incident" },
];

const viewModes: Array<{ key: ResultViewMode; label: string }> = [
  { key: "candidates", label: "Candidates" },
  { key: "lgas", label: "LGAs" },
  { key: "ras", label: "Wards" },
  { key: "pus", label: "PUs" },
];

export default function ElectionDetailView({ slug }: ElectionDetailViewProps) {
  const detail = getElectionDetailBySlug(slug);
  const [detailTab, setDetailTab] = useState<ElectionDetailTab>("result");
  const [viewMode, setViewMode] = useState<ResultViewMode>("candidates");
  const [mode, setMode] = useState<CollationMode>("raw");
  const [filterLgaId, setFilterLgaId] = useState<string | null>(null);
  const [filterWardId, setFilterWardId] = useState<string | null>(null);
  const [traceRow, setTraceRow] = useState<AreaResultRow | null>(null);
  const [sheetRow, setSheetRow] = useState<AreaResultRow | null>(null);

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

  const filteredAreaRows = useMemo(() => {
    if (!detail || viewMode === "candidates") return [];
    if (viewMode === "lgas") return detail.lgas;
    if (viewMode === "ras") {
      if (!filterLgaId) return detail.ras;
      return detail.ras.filter((row) => row.parentId === filterLgaId);
    }
    if (!filterWardId) {
      if (!filterLgaId) return detail.pus;
      const wardIds = new Set(
        detail.ras.filter((w) => w.parentId === filterLgaId).map((w) => w.id)
      );
      return detail.pus.filter((row) => row.parentId && wardIds.has(row.parentId));
    }
    return detail.pus.filter((row) => row.parentId === filterWardId);
  }, [detail, viewMode, filterLgaId, filterWardId]);

  function clearDrillFilters() {
    setFilterLgaId(null);
    setFilterWardId(null);
  }

  function handleViewModeChange(next: ResultViewMode) {
    setViewMode(next);
    if (next === "candidates" || next === "lgas") clearDrillFilters();
    if (next === "ras") setFilterWardId(null);
  }

  function handleRowSelect(row: AreaResultRow) {
    setTraceRow(row);
  }

  function handleDrillDown() {
    if (!traceRow) return;
    if (viewMode === "lgas") {
      setFilterLgaId(traceRow.id);
      setFilterWardId(null);
      setViewMode("ras");
    } else if (viewMode === "ras") {
      setFilterWardId(traceRow.id);
      if (traceRow.parentId) setFilterLgaId(traceRow.parentId);
      setViewMode("pus");
    }
    setTraceRow(null);
  }

  if (!detail) {
    const meta = getElectionListingMetaBySlug(slug);
    const year = getYearForSlug(slug);
    return (
      <div className="min-h-screen overflow-x-hidden bg-gray-50/80 pb-16">
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
  const filterLgaName = detail.lgas.find((l) => l.id === filterLgaId)?.name;
  const filterWardName = detail.ras.find((w) => w.id === filterWardId)?.name;

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50/80 pb-16">
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

        <div className="mb-6 flex gap-1 overflow-x-auto border-b border-gray-200 md:mb-8">
          {detailTabs.map((tab) => {
            const active = detailTab === tab.key;
            const label =
              tab.key === "post-incident"
                ? `Post incident ${detail.incidentCount}`
                : tab.label;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setDetailTab(tab.key)}
                className={`relative shrink-0 px-4 py-3 text-sm font-semibold transition-colors md:px-5 ${
                  active ? "text-brand-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
                {active ? (
                  <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-brand-500" />
                ) : null}
              </button>
            );
          })}
        </div>

        {detailTab === "post-incident" ? (
          <IncidentsTabPanel totalCount={detail.incidentCount} />
        ) : (
          <div className="grid gap-5 md:gap-6">
            <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-6">
              <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold text-gray-900 md:text-xl">
                  Vote Result
                </h2>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                  <CollationModeToggle mode={mode} onChange={setMode} />
                  <div className="grid w-full grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 xs:grid-cols-4 sm:inline-flex sm:w-auto sm:gap-0">
                    {viewModes.map((item) => {
                      const active = viewMode === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => handleViewModeChange(item.key)}
                          className={`min-h-11 rounded-md px-2 py-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
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

              {(filterLgaName || filterWardName) &&
              (viewMode === "ras" || viewMode === "pus") ? (
                <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-800 sm:text-sm">
                  <span className="font-medium">Showing:</span>
                  <span>{detail.location}</span>
                  {filterLgaName ? (
                    <>
                      <span className="text-brand-400">→</span>
                      <span>{filterLgaName}</span>
                    </>
                  ) : null}
                  {filterWardName ? (
                    <>
                      <span className="text-brand-400">→</span>
                      <span>{filterWardName}</span>
                    </>
                  ) : null}
                  <button
                    type="button"
                    onClick={clearDrillFilters}
                    className="ml-auto min-h-9 rounded-md px-2 font-semibold text-brand-700 hover:bg-white/70"
                  >
                    Clear filter
                  </button>
                </div>
              ) : null}

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
                    rows={filteredAreaRows}
                    onRowSelect={handleRowSelect}
                  />
                )}
              </div>
            </section>

            <ElectionMapCard
              regions={detail.mapRegions}
              legend={detail.mapLegend}
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
              <div className="relative z-0 min-w-0">
                <VoteDistributionChart series={charts.series} />
              </div>
              <div className="relative z-10 min-w-0">
                <CollationVoteShare
                  series={charts.series}
                  subtitle="All candidates across nation"
                />
              </div>
            </div>

            <p className="text-center text-sm text-error-600">
              Disclaimer: Live results update continuously. Data reflects results
              obtained from INEC and is not a final declaration.
            </p>
          </div>
        )}
      </div>

      <LocationTraceModal
        open={Boolean(traceRow)}
        row={traceRow}
        mode={
          viewMode === "candidates"
            ? "lgas"
            : (viewMode as Exclude<ResultViewMode, "candidates">)
        }
        onClose={() => setTraceRow(null)}
        onDrillDown={
          viewMode === "lgas" || viewMode === "ras" ? handleDrillDown : undefined
        }
        onViewSheet={
          viewMode === "pus"
            ? () => {
                setSheetRow(traceRow);
                setTraceRow(null);
              }
            : undefined
        }
      />
      <PollingUnitResultSheetModal
        open={Boolean(sheetRow)}
        row={sheetRow}
        onClose={() => setSheetRow(null)}
      />
    </div>
  );
}
