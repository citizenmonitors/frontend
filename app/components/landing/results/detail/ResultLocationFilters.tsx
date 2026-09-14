"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown2, SearchNormal1 } from "iconsax-react";
import {
  getResultStateOptions,
  getResultYearOptions,
  resolveResultSlugForFilters,
} from "@/app/data/mockElectionDetail";

type ResultLocationFiltersProps = {
  location: string;
  year: string;
};

export default function ResultLocationFilters({
  location,
  year,
}: ResultLocationFiltersProps) {
  const router = useRouter();
  const states = useMemo(() => getResultStateOptions(), []);
  const years = useMemo(() => getResultYearOptions(), []);
  const [open, setOpen] = useState<"state" | "year" | null>(null);
  const [stateQuery, setStateQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocPointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener("pointerdown", onDocPointer);
    return () => document.removeEventListener("pointerdown", onDocPointer);
  }, []);

  const filteredStates = states.filter((s) =>
    s.location.toLowerCase().includes(stateQuery.toLowerCase())
  );

  function goTo(nextLocation: string, nextYear: string) {
    const slug = resolveResultSlugForFilters({
      location: nextLocation,
      year: nextYear,
    });
    setOpen(null);
    if (slug) router.push(`/results/${slug}`);
  }

  const chipClass =
    "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50";

  return (
    <div ref={rootRef} className="flex flex-wrap gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => (v === "state" ? null : "state"))}
          className={chipClass}
          aria-expanded={open === "state"}
          aria-haspopup="listbox"
        >
          {location}
          <ArrowDown2 size={14} className="text-gray-400" />
        </button>

        {open === "state" ? (
          <div className="absolute left-0 z-30 mt-2 w-[min(calc(100vw-2.5rem),16rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg sm:left-auto sm:right-0 sm:w-64">
            <div className="border-b border-gray-100 p-2">
              <label className="relative block">
                <SearchNormal1
                  size={14}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  autoFocus
                  value={stateQuery}
                  onChange={(e) => setStateQuery(e.target.value)}
                  placeholder="Search states..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-8 pr-2 text-sm outline-none focus:border-brand-400"
                />
              </label>
            </div>
            <ul
              role="listbox"
              className="max-h-56 overflow-y-auto py-1"
              aria-label="States with results"
            >
              {filteredStates.map((item) => (
                <li key={item.location}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={item.location === location}
                    onClick={() => goTo(item.location, item.year)}
                    className={`flex min-h-11 w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors hover:bg-brand-50 ${
                      item.location === location
                        ? "bg-brand-50 font-semibold text-brand-800"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{item.location}</span>
                    <span className="text-xs text-gray-400">{item.year}</span>
                  </button>
                </li>
              ))}
              {filteredStates.length === 0 ? (
                <li className="px-3 py-3 text-sm text-gray-500">
                  No matching states
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => (v === "year" ? null : "year"))}
          className={chipClass}
          aria-expanded={open === "year"}
          aria-haspopup="listbox"
        >
          {year}
          <ArrowDown2 size={14} className="text-gray-400" />
        </button>

        {open === "year" ? (
          <ul
            role="listbox"
            aria-label="Election years"
            className="absolute left-0 z-30 mt-2 max-h-56 w-28 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg sm:left-auto sm:right-0"
          >
            {years.map((y) => (
              <li key={y}>
                <button
                  type="button"
                  role="option"
                  aria-selected={y === year}
                  onClick={() => goTo(location, y)}
                  className={`flex min-h-11 w-full px-3 py-2.5 text-left text-sm transition-colors hover:bg-brand-50 ${
                    y === year
                      ? "bg-brand-50 font-semibold text-brand-800"
                      : "text-gray-700"
                  }`}
                >
                  {y}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
