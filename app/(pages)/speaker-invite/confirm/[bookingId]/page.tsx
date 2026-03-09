"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InviteHeader from "@/app/components/speaker-invite/InviteHeader";
import ConfirmationScreen from "@/app/components/speaker-invite/ConfirmationScreen";
import { speakerSlotsConfirmUrl } from "@/app/data/speaker-slots-api";

type ConfirmResponse = {
  bookingId?: string;
  eventName?: string;
  slot?: {
    date: string;
    timeWAT: string;
    theme: string;
    sessionType: string;
  };
};

export default function SpeakerInviteConfirmPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const [data, setData] = useState<ConfirmResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    fetch(speakerSlotsConfirmUrl(bookingId))
      .then((res) => {
        if (!res.ok) throw new Error("Booking not found");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("Booking not found or link expired"))
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Loading...</div>;
  }

  if (error || !data?.slot) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-700 font-medium">We couldn’t load this confirmation</p>
        <p className="text-sm text-gray-500 mt-1">{error || "Invalid link"}</p>
      </div>
    );
  }

  return (
    <>
      <InviteHeader eventName={data.eventName ?? "72-Hour X Space"} />
      <ConfirmationScreen
        date={data.slot.date}
        timeWAT={data.slot.timeWAT}
        theme={data.slot.theme}
        sessionType={data.slot.sessionType}
        bookingId={data.bookingId ?? bookingId}
      />
    </>
  );
}
