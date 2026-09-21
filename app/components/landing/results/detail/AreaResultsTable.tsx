"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDown2,
  ArrowLeft2,
  ArrowRight2,
  ExportSquare,
  Eye,
  SearchNormal1,
} from "iconsax-react";
import formatNumber from "@/app/utils/formatNumber";
import { AreaResultRow, ResultViewMode } from "@/app/types/irevCollation";
import { getPartyDisplayLabel } from "@/app/data/partyInfo";
import PollingUnitResultSheetModal from "./PollingUnitResultSheetModal";

type AreaResultsTableProps = {
  rows: AreaResultRow[];
  mode: Exclude<ResultViewMode, "candidates">;
  onRowSelect?: (row: AreaResultRow) => void;
};

const PAGE_SIZE = 10;

const searchPlaceholders: Record<Exclude<ResultViewMode, "candidates">, string> = {
  lgas: "Search states / LGAs",
  ras: "Search Wards",
  pus: "Search Polling Units",
};

const nameHeaders: Record<Exclude<ResultViewMode, "candidates">, string> = {
  lgas: "Name",
  ras: "Wards",
  pus: "PUs",
};

export default function AreaResultsTable({
  rows,
  mode,
  onRowSelect,
}: AreaResultsTableProps) {
  const [query, setQuery] = useState("");
  const [ledBy, setLedBy] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedPu, setSelectedPu] = useState<AreaResultRow | null>(null);

  const isPuMode = mode === "pus";

  const parties = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.places.forEach((p) => set.add(p.party)));
    return Array.from(set);
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery = row.name.toLowerCase().includes(query.toLowerCase());
      const matchesLed =
        ledBy === "all" ||
        row.places[0]?.party.toLowerCase() === ledBy.toLowerCase();
      return matchesQuery && matchesLed;
    });
  }, [rows, query, ledBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
    setSelectedPu(null);
  }, [query, ledBy, mode]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const placeCount = Math.min(
    4,
    Math.max(...rows.map((r) => r.places.length), 4)
  );
  const placeLabels = ["First", "Second", "Third", "Fourth"].slice(0, placeCount);

  const pageNumbers = useMemo(() => {
    const maxButtons = 5;
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const start = Math.max(1, Math.min(page - 2, totalPages - maxButtons + 1));
    return Array.from({ length: maxButtons }, (_, i) => start + i);
  }, [page, totalPages]);

  const mobilePageNumbers = useMemo(() => {
    const maxButtons = 3;
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const start = Math.max(1, Math.min(page - 1, totalPages - maxButtons + 1));
    return Array.from({ length: maxButtons }, (_, i) => start + i);
  }, [page, totalPages]);

  const colSpan =
    placeLabels.length + 1 + (mode !== "pus" ? 1 : 0) + (isPuMode ? 1 : 0);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      await navigator.share({ title: "Election results", url });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  }

  function ViewActionButton({ row }: { row: AreaResultRow }) {
    return (
      <button
        type="button"
        onClick={() => setSelectedPu(row)}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-25 px-3 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:border-brand-700 hover:bg-brand-700 hover:text-white"
      >
        <Eye size={14} variant="Bold" />
        View
      </button>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block w-full sm:max-w-xs">
          <SearchNormal1
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholders[mode]}
            className="min-h-11 w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-800 outline-none ring-brand-500/20 placeholder:text-gray-400 focus:border-brand-400 focus:ring-2"
          />
        </label>
        <div className="relative w-full sm:w-auto">
          <select
            value={ledBy}
            onChange={(e) => setLedBy(e.target.value)}
            className="min-h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-sm text-gray-700 outline-none focus:border-brand-400 sm:w-auto"
            aria-label="Filter by leading party"
          >
            <option value="all">Led by</option>
            {parties.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <ArrowDown2
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:ml-auto sm:w-auto"
        >
          <ExportSquare size={16} />
          Share
        </button>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 lg:hidden">
        {pageRows.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
            No results match your filters.
          </p>
        ) : (
          pageRows.map((row) => (
            <article
              key={row.id}
              role="button"
              tabIndex={0}
              onClick={() => onRowSelect?.(row)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onRowSelect?.(row);
                }
              }}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-brand-200 hover:bg-brand-25/40"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 flex-1 break-words font-bold text-gray-900">
                  {row.name}
                </p>
                {isPuMode ? (
                  <span
                    className="shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ViewActionButton row={row} />
                  </span>
                ) : null}
              </div>
              {mode !== "pus" ? (
                <p className="mt-1 text-xs text-gray-500">
                  Reported:{" "}
                  <span className="font-semibold text-gray-800">
                    {row.reported}/{row.totalUnits}
                  </span>{" "}
                  PUs
                </p>
              ) : null}
              <ul className="mt-3 grid gap-2">
                {row.places.slice(0, placeCount).map((place, i) => (
                  <li
                    key={place.party + i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-500">
                      {placeLabels[i] || `#${i + 1}`}
                    </span>
                    <span className="text-right">
                      <span className="block font-bold text-gray-900">
                        {getPartyDisplayLabel(place.party)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatNumber.commas(place.votes)} Votes
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3.5 font-semibold">{nameHeaders[mode]}</th>
                {placeLabels.map((label) => (
                  <th key={label} className="px-4 py-3.5 font-semibold">
                    {label}
                  </th>
                ))}
                {mode !== "pus" ? (
                  <th className="px-4 py-3.5 font-semibold">Reported</th>
                ) : null}
                {isPuMode ? (
                  <th className="px-4 py-3.5 text-right font-semibold">Action</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={colSpan}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No results match your filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((row, index) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowSelect?.(row)}
                    className={`cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors hover:bg-brand-25/50 ${
                      index % 2 === 1 ? "bg-gray-50/80" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-4 font-bold text-brand-800 underline-offset-2 hover:underline">
                      {row.name}
                    </td>
                    {placeLabels.map((label, i) => {
                      const place = row.places[i];
                      return (
                        <td key={label} className="px-4 py-4">
                          {place ? (
                            <>
                              <p className="font-bold leading-snug text-gray-900">
                                {getPartyDisplayLabel(place.party)}
                              </p>
                              <p className="mt-0.5 text-xs text-gray-500">
                                {formatNumber.commas(place.votes)} Votes
                              </p>
                            </>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      );
                    })}
                    {mode !== "pus" ? (
                      <td className="px-4 py-4">
                        <span className="font-bold tabular-nums text-gray-900">
                          {row.reported}/{row.totalUnits}
                        </span>{" "}
                        <span className="text-xs text-gray-500">PUs</span>
                      </td>
                    ) : null}
                    {isPuMode ? (
                      <td
                        className="px-4 py-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ViewActionButton row={row} />
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 ? (
          <div className="flex items-center justify-center gap-1 border-t border-gray-100 px-4 py-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="grid h-11 w-11 place-content-center rounded-md text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ArrowLeft2 size={16} />
            </button>
            {pageNumbers.map((n) => {
              const active = n === page;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={active ? "page" : undefined}
                  className={`grid h-11 min-w-11 place-content-center rounded-md px-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-brand-600 text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  {n}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="grid h-11 w-11 place-content-center rounded-md text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ArrowRight2 size={16} />
            </button>
          </div>
        ) : null}
      </div>

      {filtered.length > PAGE_SIZE ? (
        <div className="flex max-w-full flex-wrap items-center justify-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="grid h-11 w-11 place-content-center rounded-md text-gray-500 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ArrowLeft2 size={16} />
          </button>
          {mobilePageNumbers.map((n) => {
            const active = n === page;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`grid h-11 min-w-11 place-content-center rounded-md px-2 text-sm font-semibold ${
                  active
                    ? "bg-brand-600 text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="grid h-11 w-11 place-content-center rounded-md text-gray-500 disabled:opacity-40"
            aria-label="Next page"
          >
            <ArrowRight2 size={16} />
          </button>
        </div>
      ) : null}

      <PollingUnitResultSheetModal
        open={Boolean(selectedPu)}
        row={selectedPu}
        onClose={() => setSelectedPu(null)}
      />
    </div>
  );
}
