"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft2,
  ArrowRight2,
  Calendar,
  CloseCircle,
  DocumentUpload,
  Gallery,
  Location,
  Video,
} from "iconsax-react";
import { Button } from "antd";
import Cookies from "js-cookie";
import { cookieData } from "@/app/data/cookieData";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import { validateSession } from "@/app/redux/features/userSlice";
import { rememberAuthRedirect } from "@/app/utils/authRedirect";
import PulseLoginModal from "@/app/components/portal/pulse/PulseLoginModal";

const PAGE_SIZE = 9;
const BODY_MAX = 2000;

type IncidentMedia = {
  url: string;
  kind: "image" | "video";
};

type IncidentItem = {
  id: string;
  title: string;
  location: string;
  summary: string;
  time: string;
  media?: IncidentMedia[];
};

const seedIncidents: IncidentItem[] = [
  {
    id: "1",
    title: "Vote Trading or Voter Inducement",
    location: "COMMERCIAL SCHOOL II, ADA",
    summary:
      "A Citizen Monitors observer at the polling unit noted suspected tactics associated with vote buying by representatives and members of a political party. Agents were seen engaging voters near the queue, and reports mentioned small cash offers in exchange for support. Security presence remained limited during the peak of the activity.",
    time: "Aug 15, 2026 · 5:01 PM",
    media: [
      {
        url: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400&h=300&fit=crop",
        kind: "image",
      },
      {
        url: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop",
        kind: "image",
      },
    ],
  },
  {
    id: "2",
    title: "Violence",
    location: "IKIJA, IFETEDO",
    summary:
      "A fight broke out between an INEC official and a man during the vote-counting process, but security personnel quickly intervened. Counting resumed after a short interruption.",
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
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.user.details);
  const sessionStatus = useAppSelector(
    (state) => state.user.status.validateSession
  );

  const [page, setPage] = useState(1);
  const [incidents, setIncidents] = useState(seedIncidents);
  const [activeIncident, setActiveIncident] = useState<IncidentItem | null>(
    null
  );
  const [loginOpen, setLoginOpen] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const userPollingUnit = [
    userDetails?.pollingUnit,
    userDetails?.ward,
    userDetails?.lga,
  ]
    .map((part) => (part || "").trim())
    .filter(Boolean)
    .join(", ");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [body, setBody] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<"image" | "video" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  useEffect(() => {
    if (!Cookies.get(cookieData.login.name)) return;
    if (sessionStatus === "pending" || sessionStatus === "fulfilled") return;
    dispatch(validateSession());
  }, [dispatch, sessionStatus]);

  useEffect(() => {
    if (userDetails && pendingSubmit) {
      setPendingSubmit(false);
      handleSubmitIncident();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails, pendingSubmit]);

  useEffect(() => {
    if (!userPollingUnit) return;
    setLocation((current) => current.trim() || userPollingUnit);
  }, [userPollingUnit]);

  useEffect(() => {
    if (!activeIncident) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIncident(null);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [activeIncident]);

  const pageItems = useMemo(() => {
    const start = ((page - 1) * PAGE_SIZE) % incidents.length;
    const items: IncidentItem[] = [];
    for (let i = 0; i < PAGE_SIZE; i++) {
      const source = incidents[(start + i) % incidents.length];
      items.push({ ...source, id: `${page}-${source.id}-${i}` });
    }
    return items;
  }, [page, incidents]);

  const pageNumbers = useMemo(() => {
    const maxButtons = 5;
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const start = Math.max(1, Math.min(page - 2, totalPages - maxButtons + 1));
    return Array.from({ length: maxButtons }, (_, i) => start + i);
  }, [page, totalPages]);

  const displayName = userDetails
    ? `${userDetails.firstName || ""} ${userDetails.lastName || ""}`.trim() ||
      userDetails.anonymousUsername
    : undefined;

  function requireAuth() {
    if (userDetails) return true;
    if (Cookies.get(cookieData.login.name) && sessionStatus === "pending") {
      setPendingSubmit(true);
      return false;
    }
    if (typeof window !== "undefined") {
      rememberAuthRedirect(window.location.pathname + window.location.search);
    }
    setPendingSubmit(true);
    setLoginOpen(true);
    return false;
  }

  function resetCompose() {
    setTitle("");
    setLocation(userPollingUnit);
    setBody("");
    setMediaPreview(null);
    setMediaKind(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handlePickMedia(file: File | undefined) {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      dispatch(
        showAlert({
          message: "Please select an image or video file.",
          type: "error",
        })
      );
      return;
    }
    setMediaKind(isVideo ? "video" : "image");
    setMediaPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  function handleSubmitIncident() {
    if (!userDetails) {
      dispatch(
        showAlert({
          message: "Please log in to post an incident.",
          type: "warning",
        })
      );
      return;
    }
    if (!title.trim() || !body.trim()) {
      dispatch(
        showAlert({
          message: "Please add a title and description.",
          type: "error",
        })
      );
      return;
    }
    if (!userPollingUnit) {
      dispatch(
        showAlert({
          message:
            "Your account needs a polling unit to post an incident for this election.",
          type: "error",
        })
      );
      return;
    }
    if (body.trim().length > BODY_MAX) {
      dispatch(
        showAlert({
          message: `Description must be ${BODY_MAX} characters or fewer.`,
          type: "error",
        })
      );
      return;
    }

    const place = userPollingUnit;

    const newIncident: IncidentItem = {
      id: `new-${Date.now()}`,
      title: title.trim(),
      location: place.toUpperCase(),
      summary: body.trim(),
      time: "Just now",
      media:
        mediaPreview && mediaKind
          ? [{ url: mediaPreview, kind: mediaKind }]
          : undefined,
    };

    setIncidents((prev) => [newIncident, ...prev]);
    resetCompose();
    setActiveIncident(newIncident);
    dispatch(
      showAlert({
        message: "Your incident was posted.",
        type: "success",
      })
    );
  }

  return (
    <div className="grid gap-5 md:gap-6">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900">
            Report an incident
          </h3>
          <p className="mt-0.5 text-sm text-gray-500">
            Share what you observed — text, photo, or video.
          </p>
        </div>

        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!requireAuth()) return;
            handleSubmitIncident();
          }}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Incident title (e.g. BVAS Malfunction)"
            className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-brand-500/20 placeholder:text-gray-400 focus:border-brand-400 focus:ring-2"
          />
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Location
            </p>
            {userPollingUnit ? (
              <div className="flex flex-wrap items-center gap-2">
                {userDetails?.pollingUnit ? (
                  <span className="inline-flex min-w-0 max-w-full items-start gap-1.5 break-words rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-800">
                    <Location size={14} className="mt-0.5 shrink-0" />
                    <span className="min-w-0 break-words">
                      {userDetails.pollingUnit}
                    </span>
                  </span>
                ) : null}
                {userDetails?.ward || userDetails?.lga || userDetails?.state ? (
                  <span className="text-xs text-gray-500">
                    {[userDetails?.ward, userDetails?.lga, userDetails?.state]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                ) : null}
              </div>
            ) : (
              <p className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <Location size={14} />
                Sign in to attach your polling unit. Incidents must match this
                election&apos;s coverage.
              </p>
            )}
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
              displayName
                ? `What's happening, ${displayName.split(" ")[0]}?`
                : "What's happening at this polling unit?"
            }
            rows={5}
            maxLength={BODY_MAX}
            className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none ring-brand-500/20 placeholder:text-gray-400 focus:border-brand-400 focus:ring-2"
          />
          <p className="text-right text-xs text-gray-400">
            {body.length}/{BODY_MAX}
          </p>

          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            className="sr-only"
            onChange={(e) => {
              handlePickMedia(e.target.files?.[0]);
            }}
          />

          {mediaPreview ? (
            <div className="relative overflow-hidden rounded-xl border border-gray-200">
              {mediaKind === "video" ? (
                <video
                  src={mediaPreview}
                  controls
                  className="max-h-52 w-full bg-black object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaPreview}
                  alt="Attachment preview"
                  className="max-h-52 w-full object-cover"
                />
              )}
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-700"
                onClick={() => {
                  setMediaPreview(null);
                  setMediaKind(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-brand-300 bg-brand-25 text-sm font-medium text-brand-700 hover:bg-brand-50">
              <DocumentUpload size={18} />
              Attach picture or video
              <input
                type="file"
                accept="image/*,video/*"
                className="sr-only"
                onChange={(e) => {
                  handlePickMedia(e.target.files?.[0]);
                }}
              />
            </label>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-xs text-gray-500">
              <Gallery size={16} className="text-brand-600" />
              <Video size={16} className="text-brand-600" />
              Photo or video
            </p>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="!h-11 !rounded-lg !bg-brand-500 !px-5 !font-semibold hover:!bg-brand-600"
            >
              Post incident
            </Button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((incident) => (
          <article
            key={incident.id}
            role="button"
            tabIndex={0}
            onClick={() => setActiveIncident(incident)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveIncident(incident);
              }
            }}
            className="flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-200 hover:shadow-md md:p-5"
          >
            <h3 className="text-base font-semibold text-gray-900">
              {incident.title}
            </h3>
            <p className="mt-2 flex min-w-0 items-start gap-1.5 text-xs uppercase tracking-wide text-gray-500">
              <Location size={14} className="mt-0.5 shrink-0" />
              <span className="min-w-0 break-words">{incident.location}</span>
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-700 line-clamp-4">
              {incident.summary}
            </p>
            <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
              {incident.time}
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

      {/* Left detail panel (Dataphyte-style drawer) */}
      {activeIncident ? (
        <div
          className="fixed inset-0 z-[90] flex justify-start bg-gray-900/45"
          role="dialog"
          aria-modal="true"
          aria-label="Incident details"
          onClick={() => setActiveIncident(null)}
        >
          <aside
            className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl sm:max-w-lg animate-[slide-in-left_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
              <h3 className="text-base font-bold text-gray-900">
                Incident details
              </h3>
              <button
                type="button"
                onClick={() => setActiveIncident(null)}
                className="grid h-11 w-11 place-content-center text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                <CloseCircle size={24} />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
              <h4 className="text-xl font-bold leading-snug text-gray-900">
                {activeIncident.title}
              </h4>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <p className="inline-flex items-start gap-2">
                  <Location
                    size={16}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />
                  <span className="min-w-0 break-words uppercase tracking-wide">
                    {activeIncident.location}
                  </span>
                </p>
                <p className="inline-flex items-center gap-2">
                  <Calendar size={16} className="shrink-0 text-gray-400" />
                  {activeIncident.time}
                </p>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {activeIncident.summary}
              </p>

              {activeIncident.media && activeIncident.media.length > 0 ? (
                <div className="space-y-2 pt-2">
                  <p className="text-sm font-semibold text-gray-800">
                    Attached media
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {activeIncident.media.map((item, index) =>
                      item.kind === "video" ? (
                        <video
                          key={`${item.url}-${index}`}
                          src={item.url}
                          controls
                          className="aspect-[4/3] w-full rounded-lg bg-gray-100 object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={`${item.url}-${index}`}
                          src={item.url}
                          alt={`Incident media ${index + 1}`}
                          className="aspect-[4/3] w-full rounded-lg object-cover"
                        />
                      )
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}

      <PulseLoginModal
        open={loginOpen}
        onClose={() => {
          setLoginOpen(false);
          setPendingSubmit(false);
        }}
        onSuccess={() => {
          setLoginOpen(false);
        }}
        contextMessage="Sign in to post an election incident."
        redirectTo={
          typeof window !== "undefined"
            ? window.location.pathname + window.location.search
            : "/collation"
        }
      />

      <style jsx global>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
