"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getLatestResultSlugByType } from "@/app/data/mockElectionDetail";

const electionTypes = [
  {
    title: "Presidential Elections",
    description:
      "National elections for President and Vice President of the Federal Republic of Nigeria.",
    iconKey: "presidential" as const,
    typeKey: "presidential" as const,
  },
  {
    title: "Governorship Elections",
    description:
      "State-level elections for Governor and Deputy Governor across all 36 states and FCT.",
    iconKey: "presidential" as const,
    typeKey: "governorship" as const,
  },
  {
    title: "Senate Elections",
    description:
      "Federal upper chamber elections for Senators representing states and the FCT.",
    iconKey: "senatorial" as const,
    typeKey: "senatorial" as const,
  },
  {
    title: "House of Representatives",
    description:
      "Federal lower chamber elections for House members across 360 federal constituencies.",
    iconKey: "house-of-representatives" as const,
    typeKey: "house-of-representatives" as const,
  },
  {
    title: "State House of Assembly",
    description:
      "State legislative elections for House of Assembly members in each Nigerian state.",
    iconKey: "house-of-representatives" as const,
    typeKey: "state-house-of-assembly" as const,
  },
  {
    title: "Local Government Elections",
    description:
      "Grassroots elections for Chairmen and Councillors across 774 LGAs in Nigeria.",
    iconKey: "senatorial" as const,
    typeKey: "local-government" as const,
  },
];

const iconSrc: Record<(typeof electionTypes)[number]["iconKey"], string> = {
  presidential: "/assets/elections/presidential.svg",
  senatorial: "/assets/elections/senatorial.svg",
  "house-of-representatives": "/assets/elections/house-of-representatives.svg",
};

export default function BrowseElectionsByType() {
  return (
    <section className="min-w-0 w-full overflow-hidden border-t border-gray-200 pt-10 md:pt-14">
      <header className="mx-auto mb-10 max-w-2xl space-y-3 text-center md:mb-12 md:space-y-4">
        <h2 className="text-[24px] font-bold leading-tight tracking-tight text-gray-900 md:text-[32px]">
          Browse Elections by Type
        </h2>
        <p className="text-sm text-gray-500">
          Select an election category to explore results, candidates, and
          incidents.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {electionTypes.map((item) => (
          <article
            key={item.title}
            className="flex min-h-[280px] flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:min-h-[300px] md:p-7"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 md:h-16 md:w-16">
              <Image
                src={iconSrc[item.iconKey]}
                alt=""
                width={40}
                height={40}
                className="h-9 w-9 object-contain md:h-10 md:w-10"
              />
            </div>
            <h3 className="text-lg font-semibold leading-snug text-gray-900 md:text-xl">
              {item.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500 md:text-[15px]">
              {item.description}
            </p>
            <Link
              href={`/results/${getLatestResultSlugByType(item.typeKey)}`}
              className="mt-6 inline-flex items-center justify-center rounded-lg border border-brand-200 bg-transparent px-4 py-2.5 text-sm font-semibold text-brand-700 transition-all duration-300 ease-out hover:border-brand-700 hover:bg-brand-700 hover:text-white hover:shadow-sm"
            >
              Explore
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
