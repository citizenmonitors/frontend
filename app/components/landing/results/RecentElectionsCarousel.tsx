"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft2,
  ArrowRight2,
  Calendar,
  Timer1,
  Location,
} from "iconsax-react";
import {
  getValidityIntegrityScore,
  mockRecentElections,
} from "@/app/data/mockIrevCollation";
import { formatScorePercent } from "@/app/utils/validityIntegrityScore";
import formatNumber from "@/app/utils/formatNumber";
import CandidateAvatarPlaceholder from "./detail/CandidateAvatarPlaceholder";

const GAP_PX = 16;

export default function RecentElectionsCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    scrollLeft: number;
    moved: boolean;
    pointerId: number | null;
  }>({ active: false, startX: 0, scrollLeft: 0, moved: false, pointerId: null });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = Math.max(el.scrollWidth - el.clientWidth, 0);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateArrows]);

  function getScrollStep() {
    const el = scrollerRef.current;
    if (!el) return 320;
    const card = el.querySelector<HTMLElement>("[data-election-card]");
    if (!card) return 320;
    return card.getBoundingClientRect().width + GAP_PX;
  }

  function scrollByDir(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * getScrollStep(), behavior: "smooth" });
  }

  function snapToNearest() {
    const el = scrollerRef.current;
    if (!el) return;
    const step = getScrollStep();
    if (step <= 0) return;
    const nearest = Math.round(el.scrollLeft / step) * step;
    el.scrollTo({ left: nearest, behavior: "smooth" });
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Let native touch scrolling handle mobile; custom drag is for mouse only
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    if (e.button !== 0) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
      pointerId: e.pointerId,
    };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    const drag = dragRef.current;
    if (!el || !drag.active) return;
    const delta = e.clientX - drag.startX;
    if (Math.abs(delta) > 6) drag.moved = true;
    el.scrollLeft = drag.scrollLeft - delta;
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    const drag = dragRef.current;
    if (!el || !drag.active) return;
    drag.active = false;
    try {
      if (drag.pointerId != null) el.releasePointerCapture(drag.pointerId);
    } catch {
      /* already released */
    }
    if (drag.moved) snapToNearest();
    updateArrows();
  }

  return (
    <section className="min-w-0 w-full max-w-full overflow-hidden border-t border-gray-200 pt-10 md:pt-14">
      <div className="mb-8 flex items-start justify-between gap-4 md:mb-10">
        <div className="min-w-0 max-w-xl space-y-3">
          <h2 className="text-[24px] font-bold leading-tight tracking-tight text-gray-900 md:text-[32px]">
            Recent Elections
          </h2>
          <p className="text-sm text-gray-500 md:text-[15px]">
            Explore results, candidates, and election data from Nigeria&apos;s
            most recently covered elections.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            disabled={!canPrev}
            className="grid h-11 w-11 place-content-center rounded-full bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous elections"
          >
            <ArrowLeft2 size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            disabled={!canNext}
            className="grid h-11 w-11 place-content-center rounded-full bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next elections"
          >
            <ArrowRight2 size={18} />
          </button>
        </div>
      </div>

      {/* Viewport: 3 cards + half of 4th; white fade covers the peek */}
      <div className="relative min-w-0 w-full overflow-hidden">
        <div
          ref={scrollerRef}
          onScroll={updateArrows}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="flex w-full min-w-0 cursor-grab gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 snap-x snap-mandatory touch-pan-x active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
        {mockRecentElections.map((election) => {
          const score = getValidityIntegrityScore(election);
          const href = `/results/${election.slug}`;

          return (
            <Link
              key={election.id}
              href={href}
                data-election-card
                draggable={false}
                onClick={(e) => {
                  if (dragRef.current.moved) {
                    e.preventDefault();
                    dragRef.current.moved = false;
                  }
                }}
                className="flex min-w-0 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-shadow hover:shadow-md w-[calc((100%-16px)/1.35)] sm:w-[calc((100%-32px)/2.35)] lg:w-[calc((100%-48px)/3.5)]"
              >
                <div className="flex flex-1 flex-col gap-5 p-4 py-5 md:gap-6 md:p-5 md:py-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black">
                      {election.electionType}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        election.status === "completed"
                          ? "bg-success-50 text-success-700"
                          : "bg-warning-50 text-warning-700"
                      }`}
                    >
                      {election.status === "completed" ? "Completed" : "Live"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-medium leading-snug text-black md:text-xl">
                      {election.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {election.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Location size={14} className="text-gray-400" />
                        {election.location}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto space-y-3 pt-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                      Winner
                    </p>
                    <div className="flex items-start gap-3">
                      <CandidateAvatarPlaceholder size={40} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium uppercase tracking-wide text-black">
                              {election.winnerName}
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-gray-500">
                              {election.winnerParty}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-medium tabular-nums leading-none text-black">
                              {election.voteShare.toFixed(1)}%
                            </p>
                            <p className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">
                              Vote Share
                            </p>
                          </div>
                        </div>
                        <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(election.voteShare, 100)}%`,
                              backgroundColor: election.winnerColor,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-2 bg-brand-700 px-4 py-3 md:px-5 md:py-3.5">
                  <Timer1
                    size={14}
                    className="shrink-0 text-white"
                    variant="Bold"
                  />
                  <p className="min-w-0 flex-1 truncate text-xs text-white">
                    <span className="font-semibold tabular-nums">
                      {formatNumber.commas(election.fullyCompliantResults)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold tabular-nums">
                      {formatNumber.commas(election.totalResultsPublished)}
                    </span>{" "}
                    valid
                  </p>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-white">
                    {formatScorePercent(score)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* White cover over the half-visible 4th card */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-20 lg:w-24"
          aria-hidden
        />
      </div>
    </section>
  );
}
