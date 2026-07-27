"use client";

import { fetchAcademyArticle, fetchAcademyArticles } from "@/app/data/academyApi";
import { AcademyArticleResponse, AcademyListResponse } from "@/app/types/academy";
import { useEffect, useState } from "react";

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useAcademyArticles(): AsyncState<AcademyListResponse> {
  const [data, setData] = useState<AcademyListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchAcademyArticles()
      .then((response) => {
        if (!cancelled) {
          setData(response);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load Citizen Academy articles. Please try again later.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}

export function useAcademyArticle(slug: string): AsyncState<AcademyArticleResponse> {
  const [data, setData] = useState<AcademyArticleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);

    fetchAcademyArticle(slug)
      .then((response) => {
        if (!cancelled) {
          setData(response);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load this article. Please try again later.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { data, loading, error };
}
