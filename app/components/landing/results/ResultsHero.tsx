"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Location } from "iconsax-react";

/** Dataphyte-style hero — layout kept; Citizen Monitors content + brand colours */
export default function ResultsHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F3F8FF]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 80% at 10% 40%, rgba(5,163,156,0.10), transparent 55%), radial-gradient(ellipse 60% 70% at 90% 35%, rgba(7,187,175,0.14), transparent 50%), radial-gradient(ellipse 50% 50% at 50% 100%, rgba(227,240,255,0.9), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-[1120px] items-center gap-8 px-5 py-10 sm:gap-10 sm:px-8 sm:py-12 md:gap-12 md:py-16 lg:max-w-[1180px] lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-20 xl:max-w-[1220px]">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="font-league text-[28px] font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-[34px] md:text-[44px] lg:text-[52px]">
            Explore Nigeria{" "}
            <span className="text-brand-500">Election Data</span> in real time.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:mt-5 md:text-base md:leading-relaxed">
            Explore presidential, governorship, legislative, and local
            government elections with interactive maps, candidate profiles,
            incidents, and verified results.
          </p>
          <Link
            href="#explore-results"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 sm:mt-7 md:mt-8"
          >
            <Location size={18} variant="Bold" />
            Explore elections
          </Link>
        </div>

        <div className="relative mx-auto flex w-full max-w-[280px] justify-center sm:max-w-[340px] md:max-w-[400px] lg:max-w-[440px] lg:justify-self-end">
          {/* Soft dark disc blends the image’s black background into the light hero */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-950/90 shadow-[0_20px_50px_rgba(5,163,156,0.18)]"
            aria-hidden
          />
          <div className="relative aspect-square w-full">
            <Image
              src="/assets/results/nigeria-ballot-box.png"
              alt="Nigerian ballot box with a ballot paper in the slot"
              fill
              priority
              sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, (max-width: 1024px) 400px, 440px"
              className="object-contain object-center drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
