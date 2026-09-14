"use client";

import React, { useMemo, useState } from "react";
import { ExportSquare, SearchNormal1 } from "iconsax-react";
import formatNumber from "@/app/utils/formatNumber";
import { CandidateLeaderboardRow } from "@/app/types/irevCollation";
import CandidateAvatarPlaceholder from "./CandidateAvatarPlaceholder";

type CandidateLeaderboardProps = {
  rows: CandidateLeaderboardRow[];
};

const medalColors = ["#F5B400", "#98A2B3", "#CD7F32"];

export default function CandidateLeaderboard({ rows }: CandidateLeaderboardProps) {
  const [query, setQuery] = useState("");
  const totalVotes = useMemo(
    () => rows.reduce((sum, r) => sum + r.votes, 0),
    [rows]
  );

  const filtered = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.party.toLowerCase().includes(query.toLowerCase())
  );

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      await navigator.share({ title: "Election results", url });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  }

  function RankBadge({ index }: { index: number }) {
    if (index < 3) {
      return (
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: medalColors[index] }}
        >
          {index + 1}
        </span>
      );
    }
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center text-sm font-semibold text-gray-600">
        {index + 1}
      </span>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-xs">
          <SearchNormal1
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search candidate"
            className="min-h-11 w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-800 outline-none ring-brand-500/20 placeholder:text-gray-400 focus:border-brand-400 focus:ring-2"
          />
        </label>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ExportSquare size={16} />
          Share
        </button>
      </div>

      <div className="grid max-h-[min(72vh,880px)] gap-3 overflow-y-auto pr-1 lg:hidden">
        {filtered.map((row, index) => {
          const share = totalVotes > 0 ? (row.votes / totalVotes) * 100 : 0;
          return (
            <article
              key={row.party + row.name}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 shrink-0">
                  <RankBadge index={index} />
                </span>
                <CandidateAvatarPlaceholder size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {row.name}
                  </p>
                  <p className="text-xs text-gray-500">{row.partyName}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <p>
                      PU Won:{" "}
                      <span className="font-semibold text-gray-900">
                        {formatNumber.commas(row.puWon)}
                      </span>
                    </p>
                    <p>
                      Margin:{" "}
                      <span className="font-semibold text-gray-900">
                        {row.marginLabel}
                      </span>
                    </p>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-gray-500">Result share</span>
                      <span className="font-semibold tabular-nums text-gray-900">
                        {share.toFixed(2)}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(share, 0.5)}%`,
                          backgroundColor: row.color,
                        }}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Top: {row.topContribution.area}:{" "}
                    {formatNumber.commas(row.topContribution.votes)} (
                    {row.topContribution.share.toFixed(2)}%)
                  </p>
                  <p className="mt-2 text-base font-bold tabular-nums text-gray-900">
                    {formatNumber.commas(row.votes)}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden max-h-[min(72vh,880px)] overflow-auto rounded-xl border border-gray-200 lg:block">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase tracking-wide text-gray-500 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
            <tr>
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">PU Won</th>
              <th className="px-4 py-3 font-medium">Margin</th>
              <th className="px-4 py-3 font-medium">Result Share</th>
              <th className="px-4 py-3 font-medium">Top contribution</th>
              <th className="px-4 py-3 font-medium text-right">Total Vote</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.map((row, index) => {
              const share =
                totalVotes > 0 ? (row.votes / totalVotes) * 100 : 0;
              return (
                <tr key={row.party + row.name} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3.5">
                    <RankBadge index={index} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <CandidateAvatarPlaceholder size={40} />
                      <div>
                        <p className="font-semibold text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.partyName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-gray-800">
                    {formatNumber.commas(row.puWon)}
                  </td>
                  <td className="px-4 py-3.5 text-gray-700">{row.marginLabel}</td>
                  <td className="min-w-[140px] px-4 py-3.5">
                    <p className="mb-1 font-medium tabular-nums text-gray-900">
                      {share.toFixed(2)}%
                    </p>
                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(share, 0.5)}%`,
                          backgroundColor: row.color,
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-700">
                    {row.topContribution.area}:{" "}
                    {formatNumber.commas(row.topContribution.votes)} (
                    {row.topContribution.share.toFixed(2)}%)
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm font-bold tabular-nums text-gray-900">
                    {formatNumber.commas(row.votes)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
