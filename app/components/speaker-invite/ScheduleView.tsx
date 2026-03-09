"use client";

import React from "react";
import type { SpeakerInviteSlot, SpeakerInviteDay, SlotStatus } from "@/app/types/speaker-invite";
import SlotCard from "./SlotCard";
import TimeZoneToggle from "./TimeZoneToggle";

type Props = {
  days: SpeakerInviteDay[];
  slots: SpeakerInviteSlot[];
  currentBookingSlotId: string | null;
  useLocalTime: boolean;
  onToggleLocalTime: (use: boolean) => void;
  onSlotSelect: (slot: SpeakerInviteSlot) => void;
};

function formatTimeWAT(dayDate: string, start: string, end: string): string {
  return `${start}–${end} WAT`;
}

function formatTimeLocal(dayDate: string, start: string, end: string): string {
  const startDate = new Date(`${dayDate}T${start}:00+01:00`);
  const endDate = new Date(`${dayDate}T${end}:00+01:00`);
  const fmt = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
  return `${fmt.format(startDate)} – ${fmt.format(endDate)} (local)`;
}

function getStatus(
  slot: SpeakerInviteSlot,
  currentBookingSlotId: string | null
): SlotStatus {
  if (currentBookingSlotId === slot.id) return "yourSlot";
  if (slot.bookedCount >= slot.capacity) return "full";
  if (slot.capacity > 1 && slot.bookedCount >= slot.capacity - 1) return "fewSpotsLeft";
  return "available";
}

export default function ScheduleView({
  days,
  slots,
  currentBookingSlotId,
  useLocalTime,
  onToggleLocalTime,
  onSlotSelect,
}: Props) {
  const slotsByDay = days.map((day) => ({
    day,
    slots: slots.filter((s) => s.dayId === day.id),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Choose your slot</h2>
        <TimeZoneToggle
          useLocalTime={useLocalTime}
          onToggle={onToggleLocalTime}
        />
      </div>

      {slotsByDay.map(({ day, slots: daySlots }) => (
        <div key={day.id} className="space-y-3">
          <h3 className="text-brand-600 font-medium">
            {day.name}: {day.theme}
          </h3>
          <p className="text-sm text-gray-500">{day.date}</p>
          <div className="grid gap-3">
            {daySlots.map((slot) => {
              const timeLabel = useLocalTime
                ? formatTimeLocal(day.date, slot.start, slot.end)
                : formatTimeWAT(day.date, slot.start, slot.end);
              const status = getStatus(slot, currentBookingSlotId);
              return (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  day={day}
                  status={status}
                  timeLabel={timeLabel}
                  onSelect={() => onSlotSelect(slot)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
