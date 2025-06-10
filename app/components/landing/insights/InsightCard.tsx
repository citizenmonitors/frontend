import { Insight } from "@/app/data/insights/types";
import { ArrowRight, Link1, Link2 } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function InsightCard({ insight }: { insight: Insight }) {
  return (
    <article className="max-w-[340px] md:max-w-none flex flex-col ring-1 ring-gray-200 h-full rounded-[12px] overflow-hidden">
      <div className="h-[172px] bg-gray-400 overflow-hidden ">
        <Image
          src={insight.featuredImage}
          className="w-full h-full object-cover"
          alt={`Insight: ${insight.shortTitle} featured image`}
          width={798}
          height={381}
        />
      </div>
      <div className="px-5 py-3 flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <Image
              src={"/assets/insights/insight-eye.svg"}
              alt=""
              width={16}
              height={16}
            />
            <span className="font-league text-sm font-bold text-gray-500">Insight</span>
          </span>

          <span className="font-league text-sm font-bold text-gray-500">
            {insight.readingTimeInMinutes} min read
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            className="group/insight-title hover:text-gray-500 text-gray-700 transition-all cursor-pointer"
            href={`/insights/${insight.id}`}
          >
            <header className="font-league text-display-xs leading-tight font-semibold relative">
              {insight.title}
            </header>
          </Link>
          <p className="text-sm text-gray-500">{insight.description}</p>
        </div>

        <Link
          className="flex gap-1 items-center text-brand-500 font-medium mt-auto"
          href={`/insights/${insight.id}`}
        >
          <span className="text-xs">Read More</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
