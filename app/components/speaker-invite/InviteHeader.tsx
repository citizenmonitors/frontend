"use client";

import React from "react";

type Props = {
  eventName: string;
};

export default function InviteHeader({ eventName }: Props) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-bold text-gray-800">{eventName}</h1>
      <p className="text-gray-600 mt-1">
        Choose a speaking timeslot below. One slot per speaker.
      </p>
    </header>
  );
}
