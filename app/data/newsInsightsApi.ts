import axios from "axios";
import backendAxiosConfig from "./axiosConfig";
import { backendRoutes } from "./backend";

/** Article URL. Slugs can contain characters like "?", so encode them. */
export function newsInsightHref(slug: string) {
  return `/insights/${encodeURIComponent(slug)}`;
}

export type NewsInsightArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** HTML. Sanitize before rendering. */
  content: string;
  thumbnailUrl: string | null;
  heroImageUrl: string | null;
  publishedAt?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser: boolean;
};

export type NewsInsightComment = {
  id: string;
  body: string;
  authorName: string;
  usedAnonymous: boolean;
  avatarUrl: string | null;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  /** Edit shows only when true; Delete also shows for admins */
  isOwnedByCurrentUser: boolean;
  createdAt?: string;
  editedAt?: string | null;
};

export type NewsInsightPage = {
  title: string;
  subtitle: string;
  total: number;
  page: number;
  limit: number;
  items: NewsInsightArticle[];
};

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function urlOrNull(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

export function normalizeArticle(raw: Record<string, unknown>): NewsInsightArticle {
  return {
    id: String(raw.id ?? raw._id ?? ""),
    slug: str(raw.slug),
    title: str(raw.title),
    excerpt: str(raw.excerpt),
    content: str(raw.content),
    // The API field really is spelled `thumbnailURLUrl`
    thumbnailUrl: urlOrNull(raw.thumbnailURLUrl ?? raw.thumbnailUrl),
    heroImageUrl: urlOrNull(raw.heroImageURL ?? raw.heroImageUrl),
    publishedAt: raw.publishedAt as string | undefined,
    isPublished: raw.isPublished !== false,
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
    likesCount: Number(raw.likesCount ?? 0),
    commentsCount: Number(raw.commentsCount ?? 0),
    isLikedByCurrentUser: Boolean(raw.isLikedByCurrentUser),
  };
}

function normalizeComment(raw: Record<string, unknown>): NewsInsightComment {
  const author = (raw.author && typeof raw.author === "object"
    ? raw.author
    : {}) as Record<string, unknown>;
  return {
    id: String(raw.id ?? raw._id ?? ""),
    body: str(raw.body),
    authorName: str(author.displayName) || "Citizen",
    usedAnonymous: Boolean(author.usedAnonymous),
    avatarUrl: urlOrNull(author.avatarUrl),
    likesCount: Number(raw.likesCount ?? 0),
    isLikedByCurrentUser: Boolean(raw.isLikedByCurrentUser),
    isOwnedByCurrentUser: Boolean(raw.isOwnedByCurrentUser),
    createdAt: raw.createdAt as string | undefined,
    editedAt: urlOrNull(raw.editedAt),
  };
}

function pick(data: unknown, key: string): Record<string, unknown> {
  const record = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const nested = record[key];
  return nested && typeof nested === "object" ? (nested as Record<string, unknown>) : record;
}

export async function fetchNewsInsights(page = 1, limit = 20): Promise<NewsInsightPage> {
  const { data } = await axios.get(backendRoutes.newsInsights.list, {
    ...backendAxiosConfig(),
    params: { page, limit },
  });
  const items = Array.isArray(data?.items) ? data.items : [];
  return {
    title: str(data?.title) || "News & Insight",
    subtitle: str(data?.subtitle),
    total: Number(data?.total ?? items.length),
    page: Number(data?.page ?? page),
    limit: Number(data?.limit ?? limit),
    items: items.map(normalizeArticle),
  };
}

export async function fetchNewsInsight(slug: string): Promise<NewsInsightArticle> {
  try {
    const { data } = await axios.get(backendRoutes.newsInsights.bySlug(slug), backendAxiosConfig());
    return normalizeArticle(pick(data, "article"));
  } catch (error: any) {
    // Some stored slugs contain characters (e.g. "?") that GET /:slug rejects
    // with 400. Fall back to finding the article in the list, which has content.
    if (error?.response?.status !== 400) throw error;
    for (let page = 1; page <= 10; page += 1) {
      const result = await fetchNewsInsights(page, 50);
      const match = result.items.find((item) => item.slug === slug);
      if (match) return match;
      if (page * result.limit >= result.total || result.items.length === 0) break;
    }
    throw error;
  }
}

/** Toggle like. Returns the new state (falls back to the expected one). */
export async function toggleNewsInsightLike(
  article: Pick<NewsInsightArticle, "id" | "likesCount" | "isLikedByCurrentUser">
): Promise<{ likesCount: number; isLikedByCurrentUser: boolean }> {
  const { data } = await axios.post(
    backendRoutes.newsInsights.like(article.id),
    {},
    backendAxiosConfig()
  );
  const source = pick(data, "article");
  const liked = !article.isLikedByCurrentUser;
  return {
    likesCount:
      source.likesCount != null
        ? Number(source.likesCount)
        : Math.max(0, article.likesCount + (liked ? 1 : -1)),
    isLikedByCurrentUser:
      source.isLikedByCurrentUser != null ? Boolean(source.isLikedByCurrentUser) : liked,
  };
}

export async function fetchNewsInsightComments(articleId: string): Promise<NewsInsightComment[]> {
  const { data } = await axios.get(
    backendRoutes.newsInsights.comments(articleId),
    backendAxiosConfig()
  );
  const list = Array.isArray(data?.comments) ? data.comments : Array.isArray(data) ? data : [];
  return list.map(normalizeComment);
}

export async function createNewsInsightComment(
  articleId: string,
  body: string,
  useAnonymousDisplay = false
): Promise<NewsInsightComment> {
  const { data } = await axios.post(
    backendRoutes.newsInsights.comments(articleId),
    { body: body.trim(), useAnonymousDisplay },
    backendAxiosConfig()
  );
  return normalizeComment(pick(data, "comment"));
}

export async function toggleNewsInsightCommentLike(
  articleId: string,
  comment: Pick<NewsInsightComment, "id" | "likesCount" | "isLikedByCurrentUser">
): Promise<{ likesCount: number; isLikedByCurrentUser: boolean }> {
  const { data } = await axios.post(
    backendRoutes.newsInsights.likeComment(articleId, comment.id),
    {},
    backendAxiosConfig()
  );
  const source = pick(data, "comment");
  const liked = !comment.isLikedByCurrentUser;
  return {
    likesCount:
      source.likesCount != null
        ? Number(source.likesCount)
        : Math.max(0, comment.likesCount + (liked ? 1 : -1)),
    isLikedByCurrentUser:
      source.isLikedByCurrentUser != null ? Boolean(source.isLikedByCurrentUser) : liked,
  };
}

/** Send at least one field; 400 if nothing changes. */
export async function updateNewsInsightComment(
  articleId: string,
  commentId: string,
  changes: { body?: string; useAnonymousDisplay?: boolean }
): Promise<NewsInsightComment> {
  const { data } = await axios.patch(
    backendRoutes.newsInsights.comment(articleId, commentId),
    {
      ...(changes.body !== undefined ? { body: changes.body.trim() } : {}),
      ...(changes.useAnonymousDisplay !== undefined
        ? { useAnonymousDisplay: changes.useAnonymousDisplay }
        : {}),
    },
    backendAxiosConfig()
  );
  return normalizeComment(pick(data, "comment"));
}

export async function deleteNewsInsightComment(articleId: string, commentId: string): Promise<void> {
  await axios.delete(backendRoutes.newsInsights.comment(articleId, commentId), backendAxiosConfig());
}
