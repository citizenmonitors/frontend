"use client";

import React from "react";
import type { SpeakerInviteSlot, SlotStatus } from "@/app/types/speaker-invite";
import type { SpeakerInviteDay } from "@/app/types/speaker-invite";

type Props = {
  slot: SpeakerInviteSlot;
  day: SpeakerInviteDay;
  status: SlotStatus;
  timeLabel: string;
  onSelect: () => void;
};

const statusConfig: Record<SlotStatus, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-green-100 text-green-800" },
  fewSpotsLeft: { label: "Few spots left", className: "bg-amber-100 text-amber-800" },
  full: { label: "Full", className: "bg-gray-200 text-gray-600" },
  yourSlot: { label: "Your slot", className: "bg-brand-100 text-brand-700" },
};

export default function SlotCard({ slot, day, status, timeLabel, onSelect }: Props) {
  const { label, className } = statusConfig[status];
  const isDisabled = status === "full" || status === "yourSlot";

  return (
    <div
      role={isDisabled ? "presentation" : undefined}
      aria-disabled={isDisabled ? true : undefined}
      className={`
        border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
        ${isDisabled ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-90" : "border-gray-200 bg-white hover:border-brand-300"}
      `}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800">{timeLabel}</p>
        <p className="text-sm text-gray-600">{day.theme}</p>
        <p className="text-xs text-gray-500 mt-1">
          {slot.capacity === 1 ? "1 speaker (keynote)" : `Panel · ${slot.capacity} spots`}
        </p>
        <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded ${className}`}>
          {label}
        </span>
      </div>
      {!isDisabled && (
        <button
          type="button"
          onClick={onSelect}
          className="shrink-0 px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition"
        >
          Select slot
        </button>
      )}
    </div>
  );
}
