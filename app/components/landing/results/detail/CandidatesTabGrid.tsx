"use client";

import React from "react";
import { ArrowRight2 } from "iconsax-react";
import { CandidateLeaderboardRow } from "@/app/types/irevCollation";
import CandidateAvatarPlaceholder from "./CandidateAvatarPlaceholder";

type CandidatesTabGridProps = {
  candidates: CandidateLeaderboardRow[];
};

export default function CandidatesTabGrid({
  candidates,
}: CandidatesTabGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {candidates.map((candidate) => (
        <article
          key={`${candidate.party}-${candidate.name}`}
          className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-4 py-6 text-center shadow-sm"
        >
          <CandidateAvatarPlaceholder size={72} />
          <h3 className="mt-4 text-sm font-semibold leading-snug text-gray-900 md:text-base">
            {candidate.name}
          </h3>
          <p className="mt-1 text-xs text-gray-500">Candidate</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
              {candidate.party}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
              1 election
            </span>
          </div>
          <button
            type="button"
            className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View profile
            <ArrowRight2 size={14} />
          </button>
        </article>
      ))}
    </div>
  );
}
