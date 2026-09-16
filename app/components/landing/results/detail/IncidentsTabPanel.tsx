"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  ArrowLeft2,
  ArrowRight2,
  CloseCircle,
  Gallery,
  Location,
  Profile,
  Send2,
} from "iconsax-react";

const PAGE_SIZE = 9;

type IncidentComment = {
  id: string;
  author: string;
  body: string;
  imageUrl?: string;
  time: string;
};

type IncidentItem = {
  id: string;
  title: string;
  location: string;
  summary: string;
  time: string;
  comments: IncidentComment[];
};

const seedIncidents: IncidentItem[] = [
  {
    id: "1",
    title: "Vote Trading or Voter Inducement",
    location: "COMMERCIAL SCHOOL II, ADA",
    summary:
      "A Citizen Monitors observer at the polling unit noted suspected tactics associated with vote buying by representatives and members of a political party.",
    time: "Aug 15, 2026 · 5:01 PM",
    comments: [
      {
        id: "c1",
        author: "Ada Observer",
        body: "Saw cash exchange near the queue around 4:45pm.",
        time: "5:12 PM",
      },
    ],
  },
  {
    id: "2",
    title: "Violence",
    location: "IKIJA, IFETEDO",
    summary:
      "A fight broke out between an INEC official and a man during the vote-counting process, but security personnel quickly intervened.",
    time: "Aug 15, 2026 · 2:45 PM",
    comments: [],
  },
  {
    id: "3",
    title: "BVAS Malfunction",
    location: "STADIUM ROAD JUNCTION, OSOGBO",
    summary:
      "BVAS failed to authenticate several voters for nearly 40 minutes before a replacement device was brought to the polling unit.",
    time: "Aug 15, 2026 · 11:20 AM",
    comments: [],
  },
  {
    id: "4",
    title: "Vote Trading or Voter Inducement",
    location: "O/S, INFRONT OF OKE-OLOYINBO HEALTH CENTRE",
    summary:
      "An unidentified party agent was observed compiling names and bank account numbers of individuals who had already cast their ballots.",
    time: "Aug 15, 2026 · 4:00 PM",
    comments: [],
  },
  {
    id: "5",
    title: "Intimidation",
    location: "COMMUNITY HALL, ILOBÚ",
    summary:
      "Party supporters allegedly confronted voters near the queue, creating a tense atmosphere until police presence increased.",
    time: "Aug 15, 2026 · 1:12 PM",
    comments: [],
  },
  {
    id: "6",
    title: "Late Arrival of Materials",
    location: "1 AKEPE STREET",
    summary:
      "Polling materials arrived more than two hours after the scheduled opening time, delaying accreditation.",
    time: "Aug 15, 2026 · 9:40 AM",
    comments: [],
  },
  {
    id: "7",
    title: "Violence",
    location: "AARE WARD CENTRE",
    summary:
      "A scuffle between rival party agents briefly interrupted counting before security restored order.",
    time: "Aug 15, 2026 · 6:18 PM",
    comments: [],
  },
  {
    id: "8",
    title: "Result Sheet Alteration Claim",
    location: "IFE CENTRAL PU 012",
    summary:
      "Observers reported conflicting figures between the announced totals and the posted result sheet at the unit.",
    time: "Aug 15, 2026 · 7:05 PM",
    comments: [],
  },
  {
    id: "9",
    title: "Vote Trading or Voter Inducement",
    location: "BORIPE WARD 3",
    summary:
      "Cash distribution near the polling unit was reported by multiple independent observers during peak voting hours.",
    time: "Aug 15, 2026 · 3:22 PM",
    comments: [],
  },
  {
    id: "10",
    title: "BVAS Malfunction",
    location: "EDE NORTH PU 004",
    summary:
      "Fingerprint capture failed repeatedly for elderly voters until the device was restarted by INEC staff.",
    time: "Aug 15, 2026 · 10:55 AM",
    comments: [],
  },
  {
    id: "11",
    title: "Intimidation",
    location: "OLORUNDA PU 021",
    summary:
      "Armed individuals were allegedly sighted near the entrance, prompting temporary suspension of voting.",
    time: "Aug 15, 2026 · 12:40 PM",
    comments: [],
  },
  {
    id: "12",
    title: "Late Arrival of Materials",
    location: "ATAKUNMOSA WEST PU 008",
    summary:
      "Ballot papers and result sheets arrived after mid-morning, compressing the voting window for accredited voters.",
    time: "Aug 15, 2026 · 10:10 AM",
    comments: [],
  },
];

type IncidentsTabPanelProps = {
  totalCount?: number;
};

export default function IncidentsTabPanel({
  totalCount = 61,
}: IncidentsTabPanelProps) {
  const [page, setPage] = useState(1);
  const [incidents, setIncidents] = useState(seedIncidents);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [draftImage, setDraftImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = ((page - 1) * PAGE_SIZE) % incidents.length;
    const items: IncidentItem[] = [];
    for (let i = 0; i < PAGE_SIZE; i++) {
      const source = incidents[(start + i) % incidents.length];
      items.push({ ...source, id: `${page}-${source.id}-${i}` });
    }
    return items;
  }, [page, incidents]);

  const activeIncident = useMemo(() => {
    if (!activeId) return null;
    return pageItems.find((item) => item.id === activeId) ?? null;
  }, [activeId, pageItems]);

  const pageNumbers = useMemo(() => {
    const maxButtons = Math.min(totalPages, 5);
    return Array.from({ length: maxButtons }, (_, i) => i + 1);
  }, [totalPages]);

  function handlePickImage(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setDraftImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  function handleSubmitComment() {
    if (!activeIncident) return;
    const body = draft.trim();
    if (!body && !draftImage) return;

    const comment: IncidentComment = {
      id: `local-${Date.now()}`,
      author: "You",
      body: body || "Shared a photo",
      imageUrl: draftImage ?? undefined,
      time: "Just now",
    };

    // Page ids look like `${page}-${source.id}-${i}` — recover seed id
    const parts = activeIncident.id.split("-");
    const seedId = parts.length >= 2 ? parts[1] : activeIncident.id;

    setIncidents((prev) =>
      prev.map((item) =>
        item.id === seedId
          ? { ...item, comments: [...item.comments, comment] }
          : item
      )
    );
    setDraft("");
    setDraftImage(null);
  }

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((incident) => (
          <article
            key={incident.id}
            role="button"
            tabIndex={0}
            onClick={() => setActiveId(incident.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveId(incident.id);
              }
            }}
            className="flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-200 hover:shadow-md md:p-5"
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
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
              <span>{incident.time}</span>
              <span className="font-medium text-brand-600">
                {incident.comments.length} comments · Join
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="grid h-11 w-11 place-content-center rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ArrowLeft2 size={16} />
        </button>
        {pageNumbers.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setPage(n)}
            className={`grid h-11 min-w-11 place-content-center rounded-lg px-2 text-sm font-medium ${
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
          className="grid h-11 w-11 place-content-center rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40"
          aria-label="Next page"
        >
          <ArrowRight2 size={16} />
        </button>
      </div>

      {activeIncident ? (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-gray-900/50 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveId(null)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-xl flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4 sm:p-5">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-gray-900">
                  {activeIncident.title}
                </h3>
                <p className="mt-1 inline-flex items-center gap-1 text-xs uppercase text-gray-500">
                  <Location size={12} />
                  {activeIncident.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="grid h-11 w-11 place-content-center text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                <CloseCircle size={24} />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
              <p className="text-sm leading-relaxed text-gray-700">
                {activeIncident.summary}
              </p>
              <p className="text-xs text-gray-400">{activeIncident.time}</p>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="mb-3 text-sm font-semibold text-gray-800">
                  Discussion
                </h4>
                {activeIncident.comments.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No comments yet. Be the first to share an update.
                  </p>
                ) : (
                  <ul className="grid gap-3">
                    {activeIncident.comments.map((comment) => (
                      <li
                        key={comment.id}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-3"
                      >
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="grid h-7 w-7 place-content-center rounded-full bg-brand-50 text-brand-600">
                            <Profile size={14} variant="Bold" />
                          </span>
                          <span className="text-sm font-semibold text-gray-800">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-400">
                            · {comment.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.body}</p>
                        {comment.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={comment.imageUrl}
                            alt="Comment attachment"
                            className="mt-2 max-h-48 rounded-lg object-cover"
                          />
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 p-3 sm:p-4">
              {draftImage ? (
                <div className="mb-2 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={draftImage}
                    alt="Selected"
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    className="text-xs font-medium text-error-600"
                    onClick={() => setDraftImage(null)}
                  >
                    Remove photo
                  </button>
                </div>
              ) : null}
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="grid h-11 w-11 shrink-0 place-content-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                  aria-label="Add picture"
                >
                  <Gallery size={18} />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePickImage(e.target.files?.[0])}
                />
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={2}
                  placeholder="Add a comment…"
                  className="min-h-11 flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="button"
                  onClick={handleSubmitComment}
                  className="grid h-11 w-11 shrink-0 place-content-center rounded-lg bg-brand-500 text-white hover:bg-brand-600"
                  aria-label="Send comment"
                >
                  <Send2 size={18} variant="Bold" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
