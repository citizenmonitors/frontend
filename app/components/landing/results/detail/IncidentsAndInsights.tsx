import React from "react";
import Link from "next/link";
import { ArrowRight2, Location } from "iconsax-react";

const incidents = [
  {
    id: "1",
    title: "Vote Trading or Voter Inducement",
    location: "COMMERCIAL SCHOOL II, ADA",
    summary:
      "A Citizen Monitors observer at the polling unit noted suspected tactics associated with vote buying by representatives and members of a political party.",
    time: "Aug 15, 2026 · 5:01 PM",
    electionType: "Governorship",
  },
  {
    id: "2",
    title: "Violence",
    location: "IKIJA, IFETEDO",
    summary:
      "A fight broke out between an INEC official and a man during the vote-counting process, but security personnel quickly intervened to resolve the situation.",
    time: "Aug 15, 2026 · 2:45 PM",
    electionType: "Governorship",
  },
  {
    id: "3",
    title: "Vote Trading or Voter Inducement",
    location: "O/S, INFRONT OF OKE-OLOYINBO HEALTH CENTRE",
    summary:
      "At the polling unit, an unidentified party agent was observed compiling names and bank account numbers of individuals who had already cast their ballots.",
    time: "Aug 15, 2026 · 4:00 PM",
    electionType: "Governorship",
  },
];

const insights = [
  {
    id: "1",
    title: "Osun Governorship Election 2026: Candidates Cast Their Ballots",
    href: "/insights",
    badge: "LIVE",
  },
  {
    id: "2",
    title: "Osun Governorship Election 2026: End-of-day election analysis",
    href: "/insights",
  },
  {
    id: "3",
    title: "Adeleke announced winner, returns for second term",
    href: "/insights",
  },
];

export default function IncidentsAndInsights() {
  return (
    <div className="grid min-w-0 w-full max-w-full gap-10 overflow-hidden md:gap-14">
      <section>
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <h2 className="text-[24px] font-bold leading-tight tracking-tight text-gray-900 md:text-[32px]">
              Recent Election Incidents
            </h2>
            <p className="text-sm text-gray-500">
              Latest reported election-related incidents across locations and
              elections.
            </p>
          </div>
          <Link
            href="/collation"
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-brand-200 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
          >
            View all
            <ArrowRight2 size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {incidents.map((incident) => (
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
              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-3">
                {incident.summary}
              </p>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs">
                <span className="text-gray-500">{incident.time}</span>
                <span className="font-medium text-brand-600">
                  {incident.electionType}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <h2 className="text-[24px] font-bold leading-tight tracking-tight text-gray-900 md:text-[32px]">
              Latest Reports &amp; Insights
            </h2>
            <p className="text-sm text-gray-500">
              Analysis, reports, and election coverage from Citizen Monitors.
            </p>
          </div>
          <Link
            href="/insights"
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-brand-200 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
          >
            View all
            <ArrowRight2 size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {insights.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex min-h-[160px] flex-col justify-between rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md ${
                index === 0 ? "bg-brand-50" : "bg-white"
              }`}
            >
              {item.badge ? (
                <span className="inline-flex w-fit rounded-full bg-error-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {item.badge}
                </span>
              ) : (
                <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
                  Insight
                </span>
              )}
              <h3 className="mt-4 text-base font-semibold leading-snug text-gray-900">
                {item.title}
              </h3>
              <span className="mt-4 text-sm font-medium text-brand-700">
                Read more
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
