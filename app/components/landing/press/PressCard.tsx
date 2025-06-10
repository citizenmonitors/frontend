import { Press } from "@/app/data/press/types";
import dayjs from "dayjs";
import { Book1, Calendar, Calendar1 } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type PressCardProps = {
  article: Press;
  horizontal?: boolean;
};

export default function PressCard({ article, horizontal }: PressCardProps) {
  return (
    <article className={"flex flex-col gap-3" + (horizontal ? " md:flex-row lg:items-center" : "")}>
      <div className={`h-[150px] bg-gray-200 rounded-xl overflow-hidden ${horizontal ? 'min-w-[220px] w-full md:w-auto' : 'w-full'}`}>
        <Image
          className="object-cover w-full h-full"
          src={article.featuredImage}
          alt={article.title}
          width={500}
          height={500}
        />
      </div>

      <div className={`flex flex-col ${horizontal ? "gap-2" : "gap-4"}`}>
        <span className="w-fit bg-brand-500 rounded font-league text-[10px] text-white font-bold py-1 px-2 flex gap-1 items-center">
          <Book1 size={12} />
          Press
        </span>

        <Link
          className="group/insight-title hover:text-gray-500 text-gray-700 transition-all cursor-pointer"
          href={`/press/${article.id}`}
        >
          <header className={`font-league leading-[1.1] font-semibold relative ${horizontal ? "text-xl" : "text-display-xs"}`}>
            {article.title}
          </header>
        </Link>

        <div className="flex items-center justify-between text-xs uppercase">
          <span>
            BY <b>{article.author}</b>
          </span>
          <span className="flex gap-1 items-center">
            <Calendar size={16} />
            {dayjs(article.date).format("MMMM D, YYYY")}
          </span>
        </div>
      </div>
    </article>
  );
}
