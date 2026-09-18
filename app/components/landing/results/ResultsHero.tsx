"use client";

import React from "react";
import Link from "next/link";
import { Location } from "iconsax-react";

/** Full banner on desktop; narrative-only on mobile */
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

      <div className="relative mx-auto grid w-full max-w-[1120px] items-center gap-6 border-b border-gray-100 px-5 py-6 sm:px-8 sm:py-8 lg:max-w-[1180px] lg:grid-cols-2 lg:gap-12 lg:border-b-0 lg:px-10 lg:py-20 xl:max-w-[1220px]">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <h1 className="font-league text-[24px] font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-[32px] md:text-[40px] lg:text-[52px] lg:leading-[1.1]">
            Explore Nigeria&apos;s{" "}
            <span className="text-brand-500">Election Data</span> in real time.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:mt-4 sm:text-base md:leading-relaxed lg:mt-5">
            Explore presidential, governorship, legislative, and local
            government elections with interactive maps, candidate profiles,
            incidents, and verified results.
          </p>
          <Link
            href="#explore-results"
            className="mt-8 hidden min-h-11 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 lg:inline-flex"
          >
            <Location size={18} variant="Bold" />
            Explore elections
          </Link>
        </div>

        <div className="mx-auto hidden w-full max-w-[440px] lg:block lg:justify-self-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/results/nigeria-ballot-box.png"
            alt="Nigerian ballot box with a ballot paper in the slot"
            width={500}
            height={500}
            className="mx-auto h-auto w-full bg-transparent"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
