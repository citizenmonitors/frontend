"use client";

import React, { useState } from "react";
import { Button, Input } from "antd";
import type { SpeakerInviteSlot, BookResponse } from "@/app/types/speaker-invite";
import type { SpeakerInviteDay } from "@/app/types/speaker-invite";
import { speakerSlotsBookUrl } from "@/app/data/speaker-slots-api";

type Props = {
  slot: SpeakerInviteSlot;
  day: SpeakerInviteDay;
  token: string;
  onSuccess: (data: BookResponse) => void;
  onCancel: () => void;
};

export default function SpeakerBookingForm({ slot, day, token, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(speakerSlotsBookUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteToken: token,
          slotId: slot.id,
          fullName: name,
          email,
          xHandle,
          phone: phone || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || "Something went wrong");
        return;
      }
      onSuccess({
        bookingId: data.bookingId ?? data.id,
        slot: data.slot ?? {
          date: day.date,
          timeWAT: `${slot.start}–${slot.end} WAT`,
          theme: slot.theme,
          sessionType: slot.sessionType,
        },
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">
        {day.name}: {day.theme} · {slot.start}–{slot.end} WAT
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your full name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">X handle *</label>
        <Input
          value={xHandle}
          onChange={(e) => setXHandle(e.target.value)}
          required
          placeholder="@username"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+234..."
        />
      </div>

      {error && (
        <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="primary" htmlType="submit" loading={loading}>
          Confirm slot
        </Button>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
