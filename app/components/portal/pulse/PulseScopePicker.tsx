"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowDown2 } from "iconsax-react";
import {
  defaultPulsePostScope,
  getPlaceNameForScope,
  PULSE_POST_SCOPES,
  PulsePostScope,
} from "@/app/utils/pulseUtils";

type PulseScopePickerProps = {
  value: PulsePostScope;
  onChange: (next: PulsePostScope) => void;
  compact?: boolean;
  location?: {
    state?: string;
    lga?: string;
    ward?: string;
    pollingUnit?: string;
  } | null;
};

function optionCopy(
  location: PulseScopePickerProps["location"],
  scope: PulsePostScope,
  label: string
) {
  const place = getPlaceNameForScope(location ?? null, scope);
  return {
    place,
    title: place ? `Post within ${place}` : `Post within ${label}`,
    enabled:
      Boolean(place) || scope === defaultPulsePostScope(location ?? null),
  };
}

export default function PulseScopePicker({
  value,
  onChange,
  compact = false,
  location,
}: PulseScopePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = PULSE_POST_SCOPES.find((scope) => scope.key === value);
  const selectedCopy = optionCopy(
    location,
    value,
    selected?.label ?? "State"
  );

  useEffect(() => {
    function onDocPointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const triggerLabel = compact
    ? selectedCopy.place || selected?.label || "State"
    : selectedCopy.title;

  return (
    <div
      ref={rootRef}
      className={`relative ${compact ? "w-auto max-w-[7.5rem] shrink-0" : "min-w-0 w-full"}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        title={selectedCopy.title}
        className={`flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 text-left outline-none hover:bg-gray-100 focus:border-brand-400 ${
          compact
            ? "min-h-9 max-w-[7.5rem] px-2.5 py-1"
            : "min-h-11 w-full gap-2 px-3 py-1.5"
        }`}
      >
        <span
          className={`min-w-0 truncate font-semibold text-brand-700 ${
            compact ? "text-xs" : "flex-1 text-xs sm:text-sm"
          }`}
        >
          {triggerLabel}
        </span>
        <ArrowDown2
          size={14}
          className={`shrink-0 text-brand-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Post within"
          className={`absolute z-40 mt-1.5 max-h-[min(16rem,50vh)] overflow-y-auto overflow-x-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg ${
            compact
              ? "left-0 w-[min(16rem,calc(100vw-2rem))]"
              : "left-0 right-0"
          }`}
        >
          {PULSE_POST_SCOPES.map((scope) => {
            const copy = optionCopy(location, scope.key, scope.label);
            const isSelected = scope.key === value;
            return (
              <li key={scope.key}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={!copy.enabled}
                  onClick={() => {
                    onChange(scope.key);
                    setOpen(false);
                  }}
                  className={`flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    isSelected ? "bg-brand-50" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="min-w-0">
                    <span
                      className={`block truncate text-sm font-semibold ${
                        isSelected ? "text-brand-700" : "text-gray-800"
                      }`}
                    >
                      {copy.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      {scope.label}
                    </span>
                  </span>
                  {isSelected ? (
                    <span className="shrink-0 text-[11px] font-semibold text-brand-600">
                      Selected
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
