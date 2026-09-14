import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Profile2User } from "iconsax-react";

export default function CandidatesPromoBanner() {
  return (
    <section className="relative isolate overflow-hidden rounded-2xl md:rounded-3xl min-h-[280px] md:min-h-[320px]">
      <Image
        src="/assets/showcase/showcase-people.webp"
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 1200px"
        priority={false}
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-brand-900/40"
        aria-hidden
      />

      <div className="relative z-[1] flex h-full flex-col justify-center gap-4 p-6 md:max-w-xl md:p-10 md:py-12">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50/95 px-3 py-1 text-xs font-medium text-brand-700">
          <Profile2User size={14} variant="Bold" />
          Political Candidates
        </span>
        <h2 className="text-[28px] font-bold leading-tight tracking-tight text-white md:text-[36px]">
          Know the Candidates.
          <br />
          Understand the Choices.
        </h2>
        <p className="text-sm leading-relaxed text-white/85 md:text-base">
          Browse comprehensive candidate profiles across Nigeria&apos;s
          electoral landscape, organized by office, party, election year, and
          location.
        </p>
        <Link
          href="/results"
          className="inline-flex w-fit items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          View Candidates
        </Link>
      </div>
    </section>
  );
}
