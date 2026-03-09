"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Modal } from "antd";
import type { InviteResponse, SpeakerInviteSlot, SpeakerInviteDay } from "@/app/types/speaker-invite";
import InviteHeader from "@/app/components/speaker-invite/InviteHeader";
import ScheduleView from "@/app/components/speaker-invite/ScheduleView";
import SpeakerBookingForm from "@/app/components/speaker-invite/SpeakerBookingForm";
import ConfirmationScreen from "@/app/components/speaker-invite/ConfirmationScreen";
import type { BookResponse } from "@/app/types/speaker-invite";
import { speakerSlotsInviteUrl } from "@/app/data/speaker-slots-api";

type RawSlot = Record<string, unknown> & { dayId: string; startTime?: string; endTime?: string; start?: string; end?: string; theme?: string; capacity?: number; bookedCount?: number; sessionType?: string; timezone?: string; id?: string };

function normalizeSlot(raw: RawSlot, index: number): SpeakerInviteSlot {
  const id = (raw.id as string) ?? `slot-${raw.dayId}-${index}`;
  const start = (raw.start as string) ?? (raw.startTime as string) ?? "09:00";
  const end = (raw.end as string) ?? (raw.endTime as string) ?? "10:00";
  const capacity = typeof raw.capacity === "number" ? raw.capacity : 1;
  const bookedCount = typeof raw.bookedCount === "number" ? raw.bookedCount : 0;
  const sessionType = (raw.sessionType as "keynote" | "panel") ?? "panel";
  const timezone = (raw.timezone as string) ?? "Africa/Lagos";
  const theme = (raw.theme as string) ?? "";
  return { id, dayId: raw.dayId, start, end, theme, capacity, bookedCount, sessionType, timezone };
}

function normalizeInviteResponse(raw: Record<string, unknown>): InviteResponse {
  const currentBooking = (raw.currentBooking ?? raw.existingBooking) ?? null;
  const eventFromRaw = raw.event as { name?: string; days?: SpeakerInviteDay[] } | undefined;
  const topLevelDays = raw.days as SpeakerInviteDay[] | undefined;
  let days: SpeakerInviteDay[] = eventFromRaw?.days ?? topLevelDays ?? [];
  const rawSlots = (raw.slots as RawSlot[] | undefined) ?? [];
  const slots: SpeakerInviteSlot[] = rawSlots.map((s, i) => normalizeSlot(s, i));

  if (slots.length > 0) {
    const dayIdsInSlots = Array.from(new Set(slots.map((s) => s.dayId)));
    const dayIdsWeHave = new Set(days.map((d) => d.id));
    const missingDayIds = dayIdsInSlots.filter((id) => !dayIdsWeHave.has(id));
    if (missingDayIds.length > 0) {
      const derivedDays: SpeakerInviteDay[] = missingDayIds.map((dayId, i) => {
        const firstSlot = slots.find((s) => s.dayId === dayId)!;
        const date = `2025-04-${String(10 + i).padStart(2, "0")}`;
        return { id: dayId, name: dayId, theme: firstSlot.theme || dayId, date };
      });
      days = [...days, ...derivedDays].sort((a, b) => a.date.localeCompare(b.date));
    }
  }

  const eventName = eventFromRaw?.name ?? (raw.eventName as string) ?? "72-Hour X Space";
  return { event: { name: eventName, days }, slots, currentBooking: currentBooking as InviteResponse["currentBooking"] };
}

export default function SpeakerInvitePage() {
  const params = useParams();
  const token = params.token as string;
  const [data, setData] = useState<InviteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocalTime, setUseLocalTime] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ slot: SpeakerInviteSlot; day: SpeakerInviteDay } | null>(null);
  const [confirmData, setConfirmData] = useState<BookResponse["slot"] | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(speakerSlotsInviteUrl(token))
      .then((res) => {
        if (!res.ok) throw new Error("Invalid invite link");
        return res.json();
      })
      .then((raw: Record<string, unknown>) => {
        setData(normalizeInviteResponse(raw));
      })
      .catch(() => setError("Invalid or expired invite link"))
      .finally(() => setLoading(false));
  }, [token]);

  const currentBookingSlotId = data?.currentBooking?.slotId ?? null;
  const days = data?.event?.days ?? [];
  const slots = data?.slots ?? [];
  const eventName = data?.event?.name ?? "72-Hour X Space";

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">Loading...</div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-700 font-medium">We couldn’t load this invite</p>
        <p className="text-sm text-gray-500 mt-1">{error || "Invalid link"}</p>
      </div>
    );
  }

  if (confirmData) {
    return (
      <>
        <InviteHeader eventName={eventName} />
        <ConfirmationScreen
          date={confirmData.date}
          timeWAT={confirmData.timeWAT}
          theme={confirmData.theme}
          sessionType={confirmData.sessionType}
          bookingId={bookingId ?? undefined}
        />
      </>
    );
  }

  const handleSlotSelect = (slot: SpeakerInviteSlot) => {
    const day = days.find((d) => d.id === slot.dayId);
    if (!day) return;
    setSelectedSlot({ slot, day });
  };

  const handleBookSuccess = (response: BookResponse) => {
    setSelectedSlot(null);
    setConfirmData(response.slot);
    if (response.bookingId) setBookingId(response.bookingId);
  };

  return (
    <>
      <InviteHeader eventName={eventName} />
      <ScheduleView
        days={days}
        slots={slots}
        currentBookingSlotId={currentBookingSlotId}
        useLocalTime={useLocalTime}
        onToggleLocalTime={setUseLocalTime}
        onSlotSelect={handleSlotSelect}
      />

      <Modal
        title="Confirm your slot"
        open={!!selectedSlot}
        onCancel={() => setSelectedSlot(null)}
        footer={null}
        destroyOnClose
      >
        {selectedSlot && (
          <SpeakerBookingForm
            slot={selectedSlot.slot}
            day={selectedSlot.day}
            token={token}
            onSuccess={handleBookSuccess}
            onCancel={() => setSelectedSlot(null)}
          />
        )}
      </Modal>
    </>
  );
}
