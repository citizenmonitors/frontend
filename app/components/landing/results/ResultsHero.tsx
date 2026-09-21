"use client";

import React from "react";
import CollationCountdownCard from "./CollationCountdownCard";

/** Collation landing hero — copy + next-election countdown */
export default function ResultsHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white lg:bg-[#F3F8FF]">
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 80% at 10% 40%, rgba(5,163,156,0.10), transparent 55%), radial-gradient(ellipse 60% 70% at 90% 35%, rgba(7,187,175,0.14), transparent 50%), radial-gradient(ellipse 50% 50% at 50% 100%, rgba(227,240,255,0.9), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-[1120px] items-center gap-8 border-b border-gray-100 px-5 py-6 sm:px-8 sm:py-8 lg:max-w-[1180px] lg:grid-cols-2 lg:gap-12 lg:border-b-0 lg:px-10 lg:py-16 xl:max-w-[1220px] xl:py-20">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-600 sm:mb-3 sm:text-xs">
            Collation
          </p>
          <h1 className="font-league text-[24px] font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-[32px] md:text-[40px] lg:text-[48px] lg:leading-[1.1] xl:text-[52px]">
            Explore Nigeria&apos;s{" "}
            <span className="text-brand-500">Election Data</span> in real time.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:mt-4 sm:text-base md:leading-relaxed lg:mt-5">
            The following result displays the raw data obtained from INEC&apos;s
            server, as well as the results after applying the criteria of the
            Nigerian Electoral Act (as amended in 2026).
          </p>
          <p className="mt-3 hidden text-sm text-gray-500 lg:block">
            Browse presidential, governorship, senatorial, and other races —
            with coverage, maps, and community Pulse updates in one place.
          </p>
        </div>

        <div className="mx-auto w-full max-w-[480px] lg:max-w-none lg:justify-self-end">
          <CollationCountdownCard />
        </div>
      </div>
    </section>
  );
}
