"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Eye, Profile2User } from "iconsax-react";
import formatNumber from "@/app/utils/formatNumber";
import { CollationCandidate } from "@/app/types/irevCollation";
import { OSUN_ELECTION_SLUG } from "@/app/data/mockElectionDetail";
import CandidateAvatarPlaceholder from "./detail/CandidateAvatarPlaceholder";

type CollationCandidateResultsProps = {
  candidates: CollationCandidate[];
  detailHref?: string;
};

export default function CollationCandidateResults({
  candidates,
  detailHref = `/results/${OSUN_ELECTION_SLUG}`,
}: CollationCandidateResultsProps) {
  const totalVotes = useMemo(
    () => candidates.reduce((sum, c) => sum + c.votes, 0),
    [candidates]
  );

  const previewNamed = candidates.slice(0, 3);
  const rest = candidates.slice(3);
  const othersVotes = rest.reduce((sum, c) => sum + c.votes, 0);
  const othersCount = rest.length;

  const rows: Array<CollationCandidate & { isOthers?: boolean }> = [
    ...previewNamed,
    ...(othersCount
      ? [
          {
            name: `Others (${othersCount} Political Parties)`,
            party: "Others",
            votes: othersVotes,
            color: "#98A2B3",
            isOthers: true,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      {rows.map((candidate, index) => {
        const share =
          totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
        const isLeader = index === 0 && !candidate.isOthers;

        return (
          <article
            key={`${candidate.party}-${candidate.name}`}
            className="rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm md:px-5 md:py-4"
          >
            <div className="flex items-center gap-3 md:gap-4">
              {candidate.isOthers ? (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Profile2User size={22} variant="Bold" />
                </span>
              ) : (
                <CandidateAvatarPlaceholder size={48} />
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold leading-snug text-gray-900">
                      {candidate.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {candidate.isOthers
                        ? `${othersCount} Political Parties`
                        : candidate.party}
                    </p>
                  </div>
                  <div className="shrink-0 text-right tabular-nums">
                    <p
                      className={`text-lg font-bold leading-none md:text-xl ${
                        isLeader ? "" : "text-gray-900"
                      }`}
                      style={isLeader ? { color: candidate.color } : undefined}
                    >
                      {formatNumber.commas(candidate.votes)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {share.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-[6px] overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{
                      width: `${Math.max(share, 0.4)}%`,
                      backgroundColor: candidate.color,
                    }}
                  />
                </div>
              </div>
            </div>
          </article>
        );
      })}

      <Link
        href={detailHref}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-error-600 bg-error-50 px-4 py-3.5 text-sm font-bold text-error-600 transition-colors hover:bg-error-100"
      >
        <Eye size={18} variant="Bold" />
        View full Result
      </Link>
    </div>
  );
}
