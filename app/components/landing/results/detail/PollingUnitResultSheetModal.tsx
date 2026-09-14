"use client";

import React, { useEffect } from "react";
import { CloseCircle } from "iconsax-react";
import { AreaResultRow } from "@/app/types/irevCollation";

/** Shared Form EC8A demo photo until per-PU IREV images are available */
export const DEMO_RESULT_SHEET_SRC = "/assets/results/demo-result-sheet.png";

type PollingUnitResultSheetModalProps = {
  open: boolean;
  row: AreaResultRow | null;
  onClose: () => void;
};

export default function PollingUnitResultSheetModal({
  open,
  row,
  onClose,
}: PollingUnitResultSheetModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !row) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-gray-900/60 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Result sheet for ${row.name}`}
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center gap-3 border-b border-gray-100 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {row.name}
            </p>
            <p className="text-xs text-gray-500">Polling unit result sheet</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-content-center rounded-full text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800"
            aria-label="Close result sheet"
          >
            <CloseCircle size={24} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gray-900/5 p-2 sm:p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DEMO_RESULT_SHEET_SRC}
            alt={`Election result sheet — ${row.name}`}
            className="mx-auto h-auto w-full max-w-full rounded-sm object-contain shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
