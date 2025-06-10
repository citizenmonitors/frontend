import { Press } from "@/app/data/press/types";
import dayjs from "dayjs";
import { Book1, Calendar } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type PressHighlightProps = {
  article: Press;
};

export default function PressHighlight({ article }: PressHighlightProps) {
  return (
    <div className="min-h-[520px] rounded-xl w-full text-white p-6 flex flex-col justify-end relative isolate overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 -z-10" />

      <Image
        className="absolute inset-0 object-cover w-full h-full -z-20"
        src={article.featuredImage}
        alt={article.title}
        width={500}
        height={500}
      />

      <div className="flex flex-col gap-5">
        <span className="w-fit bg-brand-500 rounded font-league text-sm font-bold py-1 px-2 flex gap-1 items-center">
          <Book1 size={16} />
          Press
        </span>

        <Link
          className="group/insight-title hover:text-white hover:underline text-gray-100 transition-all cursor-pointer"
          href={`/press/${article.id}`}
        >
          <header className="font-league text-display-lg leading-[40px] font-semibold relative">
            {article.title}
          </header>
        </Link>

        <div className="flex items-center gap-6 text-sm uppercase">
          <span>
            BY <b>{article.author}</b>
          </span>
          <span className="flex gap-1 items-center">
            <Calendar size={16} />
            {dayjs(article.date).format("MMMM D, YYYY")}
          </span>
        </div>
      </div>
    </div>
  );
}
