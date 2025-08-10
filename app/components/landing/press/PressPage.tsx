"use client";
import { Press } from "@/app/data/press/types";
import React from "react";
import { Button } from "antd";
import { ArrowRight2, Book1, Calendar, Share } from "iconsax-react";
import Link from "next/link";
import dayjs from "dayjs";
import { useAppDispatch } from "@/app/hooks/redux";
import { showAlert } from "@/app/redux/features/alertSlice";
import PressDonateCTA from "./PressDonateCTA";
import PressSocialCTA from "./PressSocialCTA";
import PressCard from "./PressCard";
import { currentPress } from "@/app/data/press";

export default function PressPage({ article }: { article: Press }) {
  const dispatch = useAppDispatch();
	const OTHER_ARTICLES_LIMIT = 4;
  const otherArticles = currentPress.filter((item) => item.id !== article.id).slice(0, OTHER_ARTICLES_LIMIT);

  function handleShareClick() {
    const shareData = {
      title: article.title,
      text: article.shortTitle,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => {
          dispatch(
            showAlert({ message: "Shared successfully.", type: "success" })
          );
        })
        .catch((error) => console.error("Error sharing:", error));
    } else if (navigator.clipboard) {
      // Copy to clipboard as a fallback
      navigator.clipboard.writeText(shareData.url).then(() => {
        dispatch(
          showAlert({ message: "Link copied to clipboard.", type: "success" })
        );
      });
    } else {
      dispatch(
        showAlert({
          message: "Sharing not supported on this browser.",
          type: "error",
        })
      );
    }
  }
  return (
    <div className="container">
      <header className="flex items-center gap-1 text-sm sticky lg:static top-[88px] md:top-[73px] bg-white z-20 py-2 md:py-4 lg:mt-8 text-gray-700 px-[2px]">
        <Link href={"/"}>Home</Link>
        <ArrowRight2 size={18} />
        <Link href={"/press"}>Press</Link>
        <ArrowRight2 size={18} className="text-brand-500" />
        <Link href={`/press/${article.id}`} className="text-brand-500">
          {article.shortTitle}
        </Link>
      </header>

      <div className="flex justify-content-between">
        <header className="flex-1 text-display-sm lg:text-display-lg font-league text-center leading-tight tracking-tight font-semibold mb-5 mt-3 lg:mb-10 lg:text-left flex flex-col gap-3">
          <h1 className="text-brand-500">CITIZEN MONITORS PRESS CENTER:</h1>{" "}
          <h2 className="leading-[0.94] text-gray-700">{article.title}</h2>
          <div className="flex justify-between lg:justify-start items-center gap-8 text-base font-inter font-normal text-gray-500 tracking-normal">
            <span className="w-fit bg-brand-500 rounded font-league text-white font-bold py-1 px-2  gap-1 items-center hidden lg:flex">
              <Book1 size={20} />
              Press
            </span>
            <span className="uppercase hidden lg:inline-block">
              BY <b>{article.author}</b>
            </span>
            <span className="flex gap-1 items-center uppercase text-sm lg:text-base">
              <Calendar size={16} />
              {dayjs(article.date).format("MMMM D, YYYY")}
            </span>
            <Button
              type="primary"
              className="flex gap-2 items-center font-league font-bold lg:hidden"
              onClick={handleShareClick}
            >
              <Share size={24} />
              <span className="pt-[2px]">Share</span>
            </Button>
          </div>
        </header>
        <Button
          type="primary"
          className="gap-2 items-center font-league font-bold hidden lg:flex"
          onClick={handleShareClick}
        >
          <Share size={24} />
          <span className="pt-[2px]">Share</span>
        </Button>
      </div>

      <div className="mb-14">
        {article.sections.map((section) => (
          <section className="grid gap-5 mb-10 relative" key={section.id}>
            <div
              id={section.id}
              className="absolute top-[-173px] lg:top-[-97px] left-0 w-full"
            />
            <div
              id={`${section.id}_observer`}
              className="absolute top-[300px] left-0 w-full"
            />
            {section.heading && (
              <header className="font-league text-display-xs md:text-display-sm font-semibold tracking-tight leading-tight">
                <h2 className="inline text-gray-700">
                  {section.heading ? section.heading + ": " : ""}
                </h2>
              </header>
            )}
            {section.content}
          </section>
        ))}
      </div>

      <div className="mb-16">
        <Button
          type="primary"
          className="flex justify-center gap-5 items-center font-league font-bold lg:text-xl"
          onClick={handleShareClick}
          block
          size="large"
        >
          <Share size={28} />
          <span className="pt-[2px]">Share this Press Release</span>
        </Button>
      </div>

      <div className="mb-16">
        <PressDonateCTA />
      </div>

      {otherArticles.length && (
        <React.Fragment>
          <h2 className="text-display-sm lg:text-display-lg font-league text-center tracking-[-2%] font-bold text-gray-700 lg:text-left mb-5 leading-[1.1]">
            Other Articles:
          </h2>
          <section
            id="other-articles"
            className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-9 mb-16"
          >
            {otherArticles.map((article, index) => (
              <PressCard key={index} article={article} />
            ))}
          </section>
        </React.Fragment>
      )}

      <PressSocialCTA />
    </div>
  );
}
