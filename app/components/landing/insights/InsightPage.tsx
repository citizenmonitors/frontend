"use client";
import insights from "@/app/data/insights/index";
import { Insight } from "@/app/data/insights/types";
import { Select } from "antd";
import { ArrowRight, ArrowRight2 } from "iconsax-react";
import Link from "next/link";
import React, { useEffect } from "react";

export default function InsightPage({ insight }: { insight: Insight }) {
  const [currentSection, setCurrentSection] = React.useState(insight.sections[0].id);

  useEffect(() => {
    // Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id.split("_")[0]);
          }
        });
      },
      { threshold: 0.5 }
    );

    insight.sections.forEach((section) => {
      const sectionDoc = document.getElementById(`${section.id}_observer`);
      if (sectionDoc) {
        observer.observe(sectionDoc);
      }
    });

    return () => {
      insight.sections.forEach((section) => {
        const sectionDoc = document.getElementById(`${section.id}_observer`);
        if (sectionDoc) {
          observer.unobserve(sectionDoc);
        }
      });
    };
  }, []);

  function handleSectionClick(sectionId: string) {
    const sectionDoc = document.getElementById(sectionId);
    if (sectionDoc) {
      sectionDoc.scrollIntoView();
    }
  }

  return (
    <div className="container">
      <header className="flex items-center gap-1 text-sm sticky lg:static top-[88px] md:top-[73px] bg-white z-20 py-2 md:py-4 lg:mt-8 text-gray-700 px-[2px]">
        <Link href={"/"}>Home</Link>
        <ArrowRight2 size={18} />
        <Link href={"/insights"}>Insights</Link>
        <ArrowRight2 size={18} className="text-brand-500" />
        <Link href={`/insights/${insight.id}`} className="text-brand-500">
          {insight.shortTitle}
        </Link>
      </header>

      <header className="text-display-sm lg:text-display-lg font-league text-center leading-tight tracking-tight font-semibold mb-5 mt-3 lg:mb-10 lg:text-left">
        <h1 className="text-brand-500">CASE STUDY:</h1>{" "}
        <h2 className="leading-[0.94] text-gray-700">{insight.title}</h2>
      </header>

      <div className="pb-2 mb-8 sticky top-[125px] md:top-[126px] z-10 bg-white lg:hidden px-[2px]">
        <Select
          size="large"
          className="!w-full h-[44px]"
          value={currentSection}
          options={insight.sections.map((section) => ({
            label: (
              <span className="font-league text-brand-500 !text-lg leading-[1]">
                {section.heading || section.subHeading}
              </span>
            ),
            value: section.id,
          }))}
          onChange={(value) => handleSectionClick(value)}
        />
      </div>

      <div className="grid grid-cols-6 gap-10 mb-6">
        <div className="col-span-2 bg-brand-500 h-fit lg:flex flex-col gap-3 p-5 sticky top-[97px] hidden">
          {/* Table of Contents */}
          {insight.sections.map((section) => (
            <React.Fragment key={section.id}>
              <Link
                href={`#${section.id}`}
                className={`font-league flex justify-between font-semibold transition-all hover:text-white/60 py-2 group/section-link ${
                  section.id === currentSection ? "!text-white" : "text-white/30"
                }`}
              >
                {section.heading || section.subHeading}
                <ArrowRight
                  size={20}
                  className={`group-hover/section-link:opacity-100 group-hover/section-link:translate-x-0 -translate-x-2 opacity-0 transition-all ${
                    section.id === currentSection ? "!opacity-100 !translate-x-0" : ""
                  }`}
                />
              </Link>
              <hr
                className={`transition-all last-of-type:hidden ${
                  section.id === currentSection ? "border-white/90" : "border-white/30"
                }`}
              />
            </React.Fragment>
          ))}
        </div>
        <div className="col-span-6 lg:col-span-4">
          {/* Case Study Content */}
          {insight.sections.map((section) => (
            <section className="grid gap-5 mb-10 relative" key={section.id}>
              <div
                id={section.id}
                className="absolute top-[-173px] lg:top-[-97px] left-0 w-full"
              />
              <div
                id={`${section.id}_observer`}
                className="absolute top-[300px] left-0 w-full"
              />
              <header className="font-league text-display-xs md:text-display-sm font-semibold tracking-tight leading-tight">
                <h2 className="inline text-gray-700">
                  {section.heading ? section.heading + ": " : ""}
                </h2>
                <h3 className="inline text-brand-500">{section.subHeading}</h3>
              </header>
              {section.content}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
