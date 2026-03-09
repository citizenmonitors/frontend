"use client";

import React, { useState } from "react";
import { Modal, Select, Button } from "antd";
import type { SpeakerBooking } from "@/app/types/speaker-invite";
import { updateBooking } from "@/app/data/admin-speaker-slots-api";

type ScheduleRow = {
  id: string;
  date: string;
  dayTheme: string;
  timeWAT: string;
};

type Props = {
  booking: SpeakerBooking;
  scheduleRows: ScheduleRow[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function MoveBookingModal({ booking, scheduleRows, onClose, onSuccess }: Props) {
  const [targetSlotId, setTargetSlotId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const options = scheduleRows.map((s) => ({
    value: s.id,
    label: `${s.date} ${s.timeWAT} (${s.dayTheme})`,
  }));

  const handleMove = async () => {
    if (!targetSlotId) return;
    setLoading(true);
    try {
      await updateBooking(booking.id, { slotId: targetSlotId });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { error?: string; message?: string } } }).response?.data?.error
          ?? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      alert(msg || "Failed to move booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Move booking"
      open
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="move" type="primary" loading={loading} disabled={!targetSlotId} onClick={handleMove}>
          Move
        </Button>,
      ]}
    >
      <p className="text-gray-600 mb-2">
        Moving <strong>{booking.name}</strong> to another slot.
      </p>
      <Select
        className="w-full"
        placeholder="Select slot"
        options={options}
        value={targetSlotId}
        onChange={setTargetSlotId}
        allowClear
      />
    </Modal>
  );
}
