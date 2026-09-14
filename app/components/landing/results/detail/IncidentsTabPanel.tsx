"use client";

import React, { useMemo, useState } from "react";
import { ArrowLeft2, ArrowRight2, Location } from "iconsax-react";

const PAGE_SIZE = 9;

const mockIncidents = [
  {
    id: "1",
    title: "Vote Trading or Voter Inducement",
    location: "COMMERCIAL SCHOOL II, ADA",
    summary:
      "A Citizen Monitors observer at the polling unit noted suspected tactics associated with vote buying by representatives and members of a political party.",
    time: "Aug 15, 2026 · 5:01 PM",
  },
  {
    id: "2",
    title: "Violence",
    location: "IKIJA, IFETEDO",
    summary:
      "A fight broke out between an INEC official and a man during the vote-counting process, but security personnel quickly intervened.",
    time: "Aug 15, 2026 · 2:45 PM",
  },
  {
    id: "3",
    title: "BVAS Malfunction",
    location: "STADIUM ROAD JUNCTION, OSOGBO",
    summary:
      "BVAS failed to authenticate several voters for nearly 40 minutes before a replacement device was brought to the polling unit.",
    time: "Aug 15, 2026 · 11:20 AM",
  },
  {
    id: "4",
    title: "Vote Trading or Voter Inducement",
    location: "O/S, INFRONT OF OKE-OLOYINBO HEALTH CENTRE",
    summary:
      "An unidentified party agent was observed compiling names and bank account numbers of individuals who had already cast their ballots.",
    time: "Aug 15, 2026 · 4:00 PM",
  },
  {
    id: "5",
    title: "Intimidation",
    location: "COMMUNITY HALL, ILOBÚ",
    summary:
      "Party supporters allegedly confronted voters near the queue, creating a tense atmosphere until police presence increased.",
    time: "Aug 15, 2026 · 1:12 PM",
  },
  {
    id: "6",
    title: "Late Arrival of Materials",
    location: "1 AKEPE STREET",
    summary:
      "Polling materials arrived more than two hours after the scheduled opening time, delaying accreditation.",
    time: "Aug 15, 2026 · 9:40 AM",
  },
  {
    id: "7",
    title: "Violence",
    location: "AARE WARD CENTRE",
    summary:
      "A scuffle between rival party agents briefly interrupted counting before security restored order.",
    time: "Aug 15, 2026 · 6:18 PM",
  },
  {
    id: "8",
    title: "Result Sheet Alteration Claim",
    location: "IFE CENTRAL PU 012",
    summary:
      "Observers reported conflicting figures between the announced totals and the posted result sheet at the unit.",
    time: "Aug 15, 2026 · 7:05 PM",
  },
  {
    id: "9",
    title: "Vote Trading or Voter Inducement",
    location: "BORIPE WARD 3",
    summary:
      "Cash distribution near the polling unit was reported by multiple independent observers during peak voting hours.",
    time: "Aug 15, 2026 · 3:22 PM",
  },
  {
    id: "10",
    title: "BVAS Malfunction",
    location: "EDE NORTH PU 004",
    summary:
      "Fingerprint capture failed repeatedly for elderly voters until the device was restarted by INEC staff.",
    time: "Aug 15, 2026 · 10:55 AM",
  },
  {
    id: "11",
    title: "Intimidation",
    location: "OLORUNDA PU 021",
    summary:
      "Armed individuals were allegedly sighted near the entrance, prompting temporary suspension of voting.",
    time: "Aug 15, 2026 · 12:40 PM",
  },
  {
    id: "12",
    title: "Late Arrival of Materials",
    location: "ATAKUNMOSA WEST PU 008",
    summary:
      "Ballot papers and result sheets arrived after mid-morning, compressing the voting window for accredited voters.",
    time: "Aug 15, 2026 · 10:10 AM",
  },
];

type IncidentsTabPanelProps = {
  totalCount?: number;
};

export default function IncidentsTabPanel({
  totalCount = 61,
}: IncidentsTabPanelProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const pageItems = useMemo(() => {
    // Cycle mock incidents across pages for UI fidelity
    const start = ((page - 1) * PAGE_SIZE) % mockIncidents.length;
    const items = [];
    for (let i = 0; i < PAGE_SIZE && items.length < PAGE_SIZE; i++) {
      const source = mockIncidents[(start + i) % mockIncidents.length];
      items.push({ ...source, id: `${page}-${source.id}-${i}` });
    }
    return items;
  }, [page]);

  const pageNumbers = useMemo(() => {
    const maxButtons = Math.min(totalPages, 7);
    return Array.from({ length: maxButtons }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((incident) => (
          <article
            key={incident.id}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-5"
          >
            <h3 className="text-base font-semibold text-gray-900">
              {incident.title}
            </h3>
            <p className="mt-2 inline-flex items-start gap-1.5 text-xs uppercase tracking-wide text-gray-500">
              <Location size={14} className="mt-0.5 shrink-0" />
              {incident.location}
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-700 line-clamp-4">
              {incident.summary}
            </p>
            <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
              {incident.time}
            </p>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="grid h-9 w-9 place-content-center rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ArrowLeft2 size={16} />
        </button>
        {pageNumbers.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setPage(n)}
            className={`grid h-9 min-w-9 place-content-center rounded-lg px-2 text-sm font-medium ${
              page === n
                ? "bg-brand-500 text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="grid h-9 w-9 place-content-center rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40"
          aria-label="Next page"
        >
          <ArrowRight2 size={16} />
        </button>
      </div>
    </div>
  );
}
