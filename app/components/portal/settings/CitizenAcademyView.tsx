"use client";

import SettingsHeader from "@/app/components/portal/settings/SettingsHeader";
import { useAcademyArticle, useAcademyArticles } from "@/app/hooks/useAcademy";
import { Spin, Tabs } from "antd";
import { Book1 } from "iconsax-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type CitizenAcademyViewProps = {
  slug?: string;
  basePath?: string;
  backHref?: string;
};

export default function CitizenAcademyView({
  slug,
  basePath = "/portal/settings/citizen-academy",
  backHref,
}: CitizenAcademyViewProps) {
  const router = useRouter();
  const { data: listData, loading: listLoading, error: listError } = useAcademyArticles();
  const activeSlug = slug ?? listData?.articles[0]?.slug ?? "";
  const { data: article, loading: articleLoading, error: articleError } =
    useAcademyArticle(activeSlug);

  useEffect(() => {
    if (!slug && listData?.articles[0]?.slug) {
      router.replace(`${basePath}/${listData.articles[0].slug}`);
    }
  }, [slug, listData, router, basePath]);

  const loading = listLoading || (!!activeSlug && articleLoading);
  const error = listError ?? articleError;

  return (
    <>
      <SettingsHeader backHref={backHref}>Citizen Academy</SettingsHeader>
      <header className="hidden md:block mb-6">
        <h2 className="font-league text-display-sm text-gray-700 font-semibold leading-[1.1] lg:text-display-base">
          Citizen Academy
        </h2>
      </header>

      <div className="py-6 bg-white md:py-8 px-3 md:px-8 ring-1 ring-gray-300 rounded-lg w-full max-w-[900px] mx-auto">
        {loading ? (
          <div className="grid place-content-center min-h-[200px]">
            <Spin size="large" />
          </div>
        ) : error ? (
          <p className="text-gray-500 text-sm text-center">{error}</p>
        ) : listData && article ? (
          <div className="grid gap-6">
            <header className="grid gap-2 text-center">
              <h3 className="font-league text-xl md:text-display-xs text-brand-500 font-semibold leading-tight">
                {listData.title}
              </h3>
              <p className="text-gray-500 text-sm max-w-screen-sm mx-auto">{listData.subtitle}</p>
            </header>

            <Tabs
              activeKey={activeSlug}
              onChange={(nextSlug) => router.replace(`${basePath}/${nextSlug}`)}
              items={listData.articles.map((item) => ({
                key: item.slug,
                label: item.title,
              }))}
              id="citizen-academy-articles-tab"
              className="citizen-academy-tabs"
            />

            <article className="grid gap-8 border-t border-gray-200 pt-6">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center gap-1 rounded bg-brand-500 px-2 py-1 font-league text-[10px] font-bold uppercase text-white">
                  <Book1 size={12} />
                  {article.category}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  {article.readMinutes} min read
                </span>
              </div>

              <p className="text-sm text-gray-500 text-center max-w-screen-sm mx-auto">
                {article.summary}
              </p>

              <div className="grid gap-8">
                {article.sections.map((section) => (
                  <section key={section.heading} className="grid gap-3">
                    <h4 className="font-league text-lg font-semibold text-gray-700">
                      {section.heading}
                    </h4>
                    <div className="grid gap-3">
                      {section.paragraphs.map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-sm md:text-base text-gray-600 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </div>
        ) : null}
      </div>
    </>
  );
}
