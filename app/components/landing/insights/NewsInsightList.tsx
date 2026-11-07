"use client";

import { fetchNewsInsights, NewsInsightArticle, newsInsightHref } from "@/app/data/newsInsightsApi";
import { Button, Skeleton } from "antd";
import dayjs from "dayjs";
import { ArrowRight, Heart, Message } from "iconsax-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const PAGE_SIZE = 9;

function NewsInsightCard({ article }: { article: NewsInsightArticle }) {
  const href = newsInsightHref(article.slug);
  return (
    <article className="flex h-full w-full max-w-[340px] flex-col overflow-hidden rounded-[12px] ring-1 ring-gray-200 md:max-w-none">
      <Link href={href} className="block h-[172px] overflow-hidden bg-gray-100">
        {article.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.thumbnailUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 px-5 py-3">
        <div className="flex justify-between font-league text-sm font-bold text-gray-500">
          <span>News &amp; Insight</span>
          {article.publishedAt ? <span>{dayjs(article.publishedAt).format("D MMM YYYY")}</span> : null}
        </div>
        <Link href={href} className="text-gray-700 transition-all hover:text-gray-500">
          <h3 className="font-league text-display-xs font-semibold leading-tight">{article.title}</h3>
        </Link>
        {article.excerpt ? <p className="line-clamp-3 text-sm text-gray-500">{article.excerpt}</p> : null}
        <div className="mt-auto flex items-center justify-between">
          <Link href={href} className="flex items-center gap-1 font-medium text-brand-500">
            <span className="text-xs">Read More</span>
            <ArrowRight size={16} />
          </Link>
          <span className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Heart size={14} /> {article.likesCount}
            </span>
            <span className="flex items-center gap-1">
              <Message size={14} /> {article.commentsCount}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}

/** Latest articles from the News & Insight API. Renders nothing if there are none. */
export default function NewsInsightList() {
  const [items, setItems] = useState<NewsInsightArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchNewsInsights(1, PAGE_SIZE)
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const data = await fetchNewsInsights(page + 1, PAGE_SIZE);
      setItems((prev) => [...prev, ...data.items.filter((a) => !prev.some((p) => p.id === a.id))]);
      setPage(page + 1);
      setTotal(data.total);
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) {
    return (
      <div className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} active paragraph={{ rows: 4 }} />
        ))}
      </div>
    );
  }
  if (items.length === 0) return null;

  return (
    <section className="mb-16 lg:mb-24">
      <h2 className="mb-6 font-league text-display-xs font-bold text-gray-700 lg:text-display-sm">
        Latest News &amp; Insight
      </h2>
      <div className="grid grid-cols-1 place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-16">
        {items.map((article) => (
          <NewsInsightCard key={article.id} article={article} />
        ))}
      </div>
      {items.length < total ? (
        <div className="mt-8 flex justify-center">
          <Button size="large" loading={loadingMore} onClick={loadMore}>
            Load more
          </Button>
        </div>
      ) : null}
    </section>
  );
}
