"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

/** Next presidential cycle (INEC-style demo target). */
const NEXT_ELECTION_AT = new Date("2027-01-16T08:00:00+01:00").getTime();

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function getTimeLeft(now: number): TimeLeft {
  const diff = Math.max(0, NEXT_ELECTION_AT - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, done: diff <= 0 };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const stats = [
  { value: "18", label: "Candidates" },
  { value: "18", label: "Parties" },
  { value: "36+FCT", label: "States" },
  { value: "Nigeria", label: "Location" },
] as const;

/** Dark countdown card — replaces ballot art on the collation hero */
export default function CollationCountdownCard() {
  const [now, setNow] = useState(() => Date.now());
  const time = useMemo(() => getTimeLeft(now), [now]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const units = [
    { value: time.done ? "0" : String(time.days), label: "Days" },
    { value: time.done ? "00" : pad(time.hours), label: "Hours" },
    { value: time.done ? "00" : pad(time.minutes), label: "Minutes" },
    { value: time.done ? "00" : pad(time.seconds), label: "Seconds" },
  ];

  return (
    <aside
      className="relative overflow-hidden rounded-3xl bg-[#0B3A42] px-5 py-6 shadow-[0_18px_50px_-24px_rgba(11,58,66,0.65)] sm:px-6 sm:py-7"
      aria-label="Countdown to the next presidential election"
    >
      {/* Soft map / atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 70% at 70% 40%, rgba(5,163,156,0.45), transparent 55%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(7,187,175,0.25), transparent 50%)",
        }}
      />
      <svg
        className="pointer-events-none absolute -right-6 top-4 h-[85%] w-auto opacity-[0.12] text-white"
        viewBox="0 0 200 220"
        fill="currentColor"
        aria-hidden
      >
        <path d="M72 18 L118 12 L148 28 L168 58 L178 98 L170 138 L152 168 L128 188 L98 198 L68 190 L42 168 L28 132 L22 92 L32 54 L52 28 Z" />
        <path
          d="M88 48 L112 44 L128 62 L124 88 L102 96 L82 78 Z"
          opacity="0.5"
        />
      </svg>

      <div className="relative grid gap-5 sm:gap-6">
        <header className="grid gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-300">
            Next election
          </p>
          <h2 className="font-league text-[26px] font-extrabold leading-tight tracking-tight text-white sm:text-[32px] sm:leading-none">
            Presidential Election – Nigeria 2027
          </h2>
          <p className="text-sm font-medium text-white/85">
            16 January, 2027 · 8:00 AM WAT
          </p>
          <p className="mt-1 max-w-sm text-sm leading-relaxed text-white/80">
            Track the countdown to Nigeria&apos;s next presidential cycle. Live
            collation and coverage will open here when voting begins.
          </p>
        </header>

        <div
          className="flex items-end justify-between gap-1 sm:gap-2"
          role="timer"
          aria-live="polite"
          aria-atomic="true"
        >
          {units.map((unit, index) => (
            <React.Fragment key={unit.label}>
              {index > 0 ? (
                <span
                  className="mb-6 flex flex-col gap-1.5 px-0.5 sm:mb-7 sm:px-1"
                  aria-hidden
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400/90" />
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400/90" />
                </span>
              ) : null}
              <div className="min-w-0 flex-1 text-center">
                <p className="font-league text-[24px] font-bold tabular-nums leading-none tracking-tight text-white sm:text-[36px] md:text-[40px]">
                  {unit.value}
                </p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-white/75 sm:text-xs sm:normal-case sm:tracking-normal">
                  {unit.label}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-center backdrop-blur-[2px]"
            >
              <p className="truncate text-sm font-bold text-white sm:text-base">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-white/75 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
          <p className="text-[11px] font-medium text-white/70 sm:text-xs">
            Based on the published INEC election timetable
          </p>
          <Link
            href="/collation/governorship-election-osun-2026"
            className="text-xs font-semibold text-brand-300 transition-colors hover:text-brand-200"
          >
            View Osun 2026 sample →
          </Link>
        </div>
      </div>
    </aside>
  );
}
