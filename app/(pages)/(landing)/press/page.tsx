"use client";
import PressCard from "@/app/components/landing/press/PressCard";
import PressDonateCTA from "@/app/components/landing/press/PressDonateCTA";
import PressHighlight from "@/app/components/landing/press/PressHighlight";
import PressSocialCTA from "@/app/components/landing/press/PressSocialCTA";
import { currentPress as press } from "@/app/data/press";
import { Press as PressType } from "@/app/data/press/types";
import React, { useEffect, useState } from "react";

export default function Press() {
  type PressState = {
    highlightedArticle: PressType;
    articles: Array<PressType>;
    otherArticles: Array<PressType>;
  };
  const [{ highlightedArticle, articles, otherArticles }, setPress] =
    useState<PressState>({
      highlightedArticle: {} as PressType,
      articles: [],
      otherArticles: [],
    });

  // This isn't strictly necessary since we initialize the state with  the data,
  useEffect(() => {
    const currentPressData = press.filter(
      (p) => new Date(p.date) <= new Date()
    );

    const highlightedArticle = currentPressData[0];
    const articles = currentPressData.slice(1, 4);
    const otherArticles = currentPressData.slice(4);

    setPress({
      highlightedArticle,
      articles,
      otherArticles,
    });
  }, []);

  return (
    <div className="container">
      <header className="text-display-sm lg:text-display-lg font-league text-center leading-tight tracking-tight font-bold mb-5 mt-3 lg:mt-[55px] lg:mb-10 lg:text-left">
        <h1 className="text-brand-500">CITIZEN MONITORS PRESS CENTER:</h1>{" "}
        <h2 className="leading-[0.94] text-gray-700">
          Your hub for official statements, press releases, and public
          information.
        </h2>
      </header>

      <div className="grid grid-cols-12 gap-8 mb-10">
        <div className="hidden lg:block col-span-12 xl:col-span-7">
          <PressHighlight article={highlightedArticle} />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <div className="flex flex-col gap-8">
            <div className="lg:hidden">
              <PressCard key={-1} article={highlightedArticle} horizontal />
            </div>
            {articles.map((article, index) => (
              <PressCard key={index} article={article} horizontal />
            ))}
          </div>
        </div>
      </div>

      <PressDonateCTA />
      <section
        id="other-articles"
        className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-9 my-10"
      >
        {otherArticles.map((article, index) => (
          <PressCard key={index} article={article} />
        ))}
      </section>
      <PressSocialCTA />
    </div>
  );
}
