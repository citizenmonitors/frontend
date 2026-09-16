"use client";

import React from "react";
import { ArrowRight2, CloseCircle, Location } from "iconsax-react";
import formatNumber from "@/app/utils/formatNumber";
import { AreaResultRow, ResultViewMode } from "@/app/types/irevCollation";

type LocationTraceModalProps = {
  open: boolean;
  row: AreaResultRow | null;
  mode: Exclude<ResultViewMode, "candidates">;
  onClose: () => void;
  onDrillDown?: () => void;
  onViewSheet?: () => void;
};

const levelLabel: Record<Exclude<ResultViewMode, "candidates">, string> = {
  lgas: "LGA",
  ras: "Ward",
  pus: "Polling Unit",
};

export default function LocationTraceModal({
  open,
  row,
  mode,
  onClose,
  onDrillDown,
  onViewSheet,
}: LocationTraceModalProps) {
  if (!open || !row) return null;

  const crumbs = [
    { key: "state", label: "State", value: row.path?.state },
    { key: "lga", label: "LGA", value: row.path?.lga },
    { key: "ward", label: "Ward", value: row.path?.ward },
    { key: "pu", label: "Polling Unit", value: row.path?.pollingUnit },
  ].filter((c) => Boolean(c.value));

  const canDrill = mode === "lgas" || mode === "ras";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-gray-900/50 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-trace-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-2xl border border-gray-200 bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              Traceable location · {levelLabel[mode]}
            </p>
            <h3
              id="location-trace-title"
              className="mt-1 break-words text-lg font-bold text-gray-900"
            >
              {row.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-content-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700"
            aria-label="Close"
          >
            <CloseCircle size={24} />
          </button>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-1.5 text-sm">
          {crumbs.map((crumb, index) => (
            <React.Fragment key={crumb.key}>
              {index > 0 ? (
                <ArrowRight2 size={14} className="shrink-0 text-gray-300" />
              ) : null}
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800">
                <Location size={12} />
                <span className="text-brand-500">{crumb.label}:</span>{" "}
                {crumb.value}
              </span>
            </React.Fragment>
          ))}
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Leading parties
          </p>
          <ul className="grid gap-2">
            {row.places.slice(0, 4).map((place) => (
              <li
                key={place.party}
                className="flex items-center justify-between text-sm"
              >
                <span className="inline-flex items-center gap-2 font-medium text-gray-800">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: place.color }}
                  />
                  {place.party}
                </span>
                <span className="tabular-nums text-gray-600">
                  {formatNumber.commas(place.votes)}
                </span>
              </li>
            ))}
          </ul>
          {mode !== "pus" ? (
            <p className="mt-3 text-xs text-gray-500">
              Reported:{" "}
              <span className="font-semibold text-gray-800">
                {row.reported}/{row.totalUnits}
              </span>{" "}
              polling units
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          {canDrill && onDrillDown ? (
            <button
              type="button"
              onClick={onDrillDown}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
            >
              {mode === "lgas" ? "View wards in this LGA" : "View polling units"}
            </button>
          ) : null}
          {mode === "pus" && onViewSheet ? (
            <button
              type="button"
              onClick={onViewSheet}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
            >
              View result sheet
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
