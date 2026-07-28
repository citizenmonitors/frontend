"use client";

import Image from "next/image";
import React, { useState } from "react";

const PULSE_INTRO_PARAGRAPHS = [
  "Hi, my name is Ade. I built Pulse for you. Not for politicians. Not for institutions. For the person on your street who has been watching things fall apart and wondering if anyone else sees it too. They do. And now you have somewhere to find each other.",
  "This is your ward, finally in one place. A community of real people, your neighbours, your streets, your shared frustrations, with somewhere useful to put it all.",
  'Talk about the clinic with no drugs. The road that\'s been "under construction" since 2019. The extortion everyone experiences and nobody is officially reporting. The government announcement and what it actually means for your street. Governance isn\'t just elections; it\'s every broken thing in between.',
  "And here's where it gets interesting. When enough people from your ward are saying the same thing, it stops being a complaint and becomes a pattern. A pattern becomes evidence. And evidence? Evidence travels; to the right desks, the right authorities, the right people who suddenly can't pretend they didn't know.",
  "Your gist has power. Use it.\nPost with your name or stay anonymous. Both work. Both matter.",
  "The magic happens when your whole ward is here. So don't come alone - bring your neighbours, your friends, the person on your street who notices everything. Every voice added makes this harder to ignore.",
  "Your ward has receipts. This is where you file them!",
];

export default function PulseEmptyState() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-[#FFFDF8] border border-gray-200 p-5 md:p-6">
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
        <div className="shrink-0 mx-auto sm:mx-0">
          <Image
            src="/assets/pulse/ade-pulse-intro.png"
            alt="Ade, creator of Pulse"
            width={120}
            height={120}
            className="h-[108px] w-[108px] md:h-[120px] md:w-[120px] rounded-full object-cover border-2 border-brand-100 shadow-sm"
            priority
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-500 mb-2 text-center sm:text-left">
            Welcome to Pulse
          </p>

          {expanded ? (
            <div className="space-y-3 text-sm md:text-base text-gray-700 leading-relaxed">
              {PULSE_INTRO_PARAGRAPHS.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm md:text-base text-gray-700 leading-relaxed line-clamp-4">
              {PULSE_INTRO_PARAGRAPHS[0]}
            </p>
          )}

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-3 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
          >
            {expanded ? "See less" : "See more"}
          </button>
        </div>
      </div>
    </div>
  );
}
