"use client";

import React from "react";
import { Modal } from "antd";
import type { SpeakerBooking } from "@/app/types/speaker-invite";

type Props = {
  booking: SpeakerBooking;
  onClose: () => void;
};

export default function ViewSpeakerModal({ booking, onClose }: Props) {
  const items = [
    { label: "Name", value: booking.name },
    { label: "Email", value: booking.email },
    { label: "X handle", value: booking.xHandle },
    { label: "Topic / angle", value: booking.topicAngle || "—" },
    { label: "Bio link", value: booking.bioLink ? (
      <a href={booking.bioLink} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline truncate block max-w-[280px]">
        {booking.bioLink}
      </a>
    ) : "—" },
    { label: "Phone", value: booking.phone || "—" },
  ];

  return (
    <Modal
      title="Speaker details"
      open
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <dl className="space-y-2 text-sm">
        {items.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-gray-500 font-medium">{label}</dt>
            <dd className="text-gray-800 mt-0.5">{value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
}
