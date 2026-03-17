"use client";

import React from "react";
import { TickCircle, Calendar } from "iconsax-react";
import { Button } from "antd";
import { speakerSlotsIcsUrl } from "@/app/data/speaker-slots-api";

function getDayDescription(theme: string): string {
  switch ((theme ?? "").trim()) {
    case "People Focus":
      return "People Focus: The theme for day 1 focuses on the people and what 2023 did to trust, lived experiences, and the polling unit as the real battleground.";
    case "People Power":
      return "People Power: The theme for day 2 focuses on the sleeping power of the people, how organization beats outrage, and what structures must exist to protect the vote.";
    case "People Protest":
      return "People Protest: The theme for day 3 focuses on people protest, disciplined evidence driven pressure, and the red lines Nigerians must refuse to tolerate again.";
    default:
      return "";
  }
}

type Props = {
  date: string;
  timeWAT: string;
  theme: string;
  sessionType: string;
  bookingId?: string;
};

export default function ConfirmationScreen({ date, timeWAT, theme, sessionType, bookingId }: Props) {
  const icsUrl = bookingId ? speakerSlotsIcsUrl(bookingId) : null;
  const dayDescription = getDayDescription(theme);

  return (
    <div className="max-w-lg mx-auto text-center space-y-6 py-8">
      <div className="flex justify-center">
        <TickCircle size={64} className="text-brand-500" variant="Bold" />
      </div>
      <h1 className="text-xl font-semibold text-brand-600">You&apos;re confirmed</h1>
      <p className="text-gray-700">
        Thank you for confirming your slot for the Citizen Monitors 72-Hour X Space.
      </p>
      <div className="bg-brand-50 rounded-lg p-6 text-left space-y-3 border border-brand-200">
        <p><span className="font-semibold text-brand-600">Date:</span> <span className="text-gray-800">{date}</span></p>
        <p><span className="font-semibold text-brand-600">Time:</span> <span className="text-gray-800">{timeWAT}</span></p>
        <p><span className="font-semibold text-brand-600">Theme:</span> <span className="text-gray-800">{theme}</span></p>
        {dayDescription ? (
          <p><span className="font-semibold text-brand-600">Description:</span> <span className="text-gray-800">{dayDescription}</span></p>
        ) : null}
      </div>
      {icsUrl && (
        <a href={icsUrl} target="_blank" rel="noopener noreferrer" download>
          <Button type="default" icon={<Calendar size={18} />} className="gap-2">
            Add to calendar (.ics)
          </Button>
        </a>
      )}
      <p className="text-sm text-brand-700">
        We&apos;ll send the Space link and speaker guidance closer to the date.
      </p>
    </div>
  );
}
