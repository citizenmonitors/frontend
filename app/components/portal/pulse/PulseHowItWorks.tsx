"use client";

import Image from "next/image";
import React, { useState } from "react";
import { InfoCircle } from "iconsax-react";

const HOW_IT_WORKS = [
  {
    title: "Share what you see",
    body: "Post updates about your street, polling unit, or community — with your name or anonymously.",
  },
  {
    title: "Filter by place",
    body: "Use All, State, LGA, Ward, or Polling Unit tabs to focus on posts from your area.",
  },
  {
    title: "Turn gist into evidence",
    body: "When many citizens report the same issue, patterns become harder to ignore.",
  },
];

/** Short explainer so first-time visitors understand Pulse */
export default function PulseHowItWorks() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 border-b border-gray-200 bg-brand-25/60 px-4 py-3 text-left text-sm font-medium text-brand-700 hover:bg-brand-50 sm:px-5"
      >
        <InfoCircle size={16} />
        What is Pulse? Tap to learn how it works
      </button>
    );
  }

  return (
    <div className="border-b border-gray-200 bg-[#F8FFFE] px-4 py-4 sm:px-5 sm:py-5">
      <div className="mb-3 flex items-start gap-3">
        <Image
          src="/assets/pulse/ade-pulse-intro.png"
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 rounded-full border border-brand-100 object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900">What is Pulse?</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            Pulse is Citizen Monitors&apos; community feed — where Nigerians
            share real-time updates about their streets, services, safety,
            governance, elections, and everyday issues where they live. Read
            freely. Sign in to post, like, or comment.
          </p>
        </div>
      </div>

      <ul className="grid gap-2.5 sm:grid-cols-3">
        {HOW_IT_WORKS.map((item) => (
          <li
            key={item.title}
            className="rounded-xl border border-brand-100 bg-white px-3 py-2.5"
          >
            <p className="text-xs font-semibold text-brand-700">{item.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">
              {item.body}
            </p>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setOpen(false)}
        className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700"
      >
        Got it — hide this
      </button>
    </div>
  );
}
