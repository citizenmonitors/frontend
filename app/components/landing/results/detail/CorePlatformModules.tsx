import React from "react";
import Link from "next/link";
import {
  DocumentText1,
  Notepad2,
  People,
  Warning2,
} from "iconsax-react";

const modules = [
  {
    title: "Election Results",
    description: "Explore results by election type, year and state",
    href: "/collation",
    icon: DocumentText1,
    iconWrap: "bg-success-50 text-success-600",
  },
  {
    title: "Candidates & Politicians",
    description: "Browse candidate profiles and election history",
    href: "/collation",
    icon: People,
    iconWrap: "bg-bluelight-50 text-bluelight-600",
  },
  {
    title: "Election Incidents",
    description: "View election-related incidents by location and election",
    href: "/collation",
    icon: Warning2,
    iconWrap: "bg-error-50 text-error-600",
  },
  {
    title: "Insights and Analytics",
    description: "Read election insights, research insights and data-driven analysis",
    href: "/insights",
    icon: Notepad2,
    iconWrap: "bg-warning-50 text-warning-600",
  },
];

export default function CorePlatformModules() {
  return (
    <section className="min-w-0 w-full max-w-full overflow-hidden border-t border-gray-200 pt-10 md:pt-14">
      <header className="mx-auto mb-10 max-w-2xl space-y-3 text-center md:mb-12 md:space-y-4">
        <h2 className="text-[24px] font-bold leading-tight tracking-tight text-gray-900 md:text-[32px]">
          Core Platform Modules
        </h2>
        <p className="text-sm text-gray-500">
          Access comprehensive election results, incidents and election
          candidates across different states and positions.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <span
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.iconWrap}`}
              >
                <Icon size={22} variant="Bold" />
              </span>
              <h3 className="text-base font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="mt-5 inline-flex items-center justify-center rounded-lg border border-brand-200 px-4 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
              >
                Explore
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
