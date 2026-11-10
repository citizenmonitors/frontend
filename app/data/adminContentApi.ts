import axios, { AxiosRequestConfig } from "axios";
import backendAxiosConfig, { backendMultipartAxiosConfig } from "./axiosConfig";
import { backendRoutes } from "./backend";
import { NewsInsightArticle, normalizeArticle } from "./newsInsightsApi";

/** Reads the API's `{ message }` error so it can be shown as-is. */
export function apiErrorMessage(error: any, fallback: string): string {
  const message = error?.response?.data?.message;
  if (typeof message === "string" && message.trim()) return message;
  if (error?.message === "Network Error") {
    return "Couldn't connect. Check your internet connection and try again.";
  }
  return fallback;
}

// ---------- Pulse reports ----------

export type PulseReportStatus = "open" | "dismissed" | "removed" | "all";

export type PulseReportPerson = {
  name: string;
  email?: string;
};

export type AdminPulseReport = {
  id: string;
  status: string;
  reason: string;
  details?: string;
  /** "post" or "comment" */
  contentType: string;
  snapshot: { body: string; imageUrl: string | null; authorName?: string };
  contentExists: boolean;
  openReportsOnContent: number;
  reporter: PulseReportPerson | null;
  reportedUser: PulseReportPerson | null;
  createdAt?: string;
  resolvedAt?: string;
  note?: string;
};

function person(raw: unknown): PulseReportPerson | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const name =
    [r.firstName, r.lastName].filter((p) => typeof p === "string" && p).join(" ") ||
    (typeof r.name === "string" ? r.name : "") ||
    (typeof r.displayName === "string" ? r.displayName : "");
  return { name: name || "Unknown", email: typeof r.email === "string" ? r.email : undefined };
}

function normalizeReport(raw: Record<string, unknown>): AdminPulseReport {
  const snap = (raw.snapshot && typeof raw.snapshot === "object"
    ? raw.snapshot
    : {}) as Record<string, unknown>;
  const snapAuthor = (snap.author && typeof snap.author === "object"
    ? snap.author
    : {}) as Record<string, unknown>;
  return {
    id: String(raw.id ?? raw._id ?? ""),
    status: String(raw.status ?? "open"),
    reason: String(raw.reason ?? ""),
    details: typeof raw.details === "string" ? raw.details : undefined,
    contentType: String(raw.contentType ?? raw.targetType ?? (raw.commentId ? "comment" : "post")),
    snapshot: {
      body: String(snap.body ?? ""),
      imageUrl: typeof snap.imageUrl === "string" && snap.imageUrl ? snap.imageUrl : null,
      authorName: typeof snapAuthor.displayName === "string" ? snapAuthor.displayName : undefined,
    },
    contentExists: raw.contentExists !== false,
    openReportsOnContent: Number(raw.openReportsOnContent ?? 0),
    reporter: person(raw.reporter),
    reportedUser: person(raw.reportedUser),
    createdAt: raw.createdAt as string | undefined,
    resolvedAt: raw.resolvedAt as string | undefined,
    note: typeof raw.note === "string" ? raw.note : undefined,
  };
}

export async function fetchPulseReports(params: {
  status: PulseReportStatus;
  page: number;
  limit: number;
}): Promise<{ reports: AdminPulseReport[]; total: number }> {
  const { data } = await axios.get(backendRoutes.pulse.adminReports, {
    ...backendAxiosConfig(),
    params,
  });
  const list = Array.isArray(data?.reports) ? data.reports : Array.isArray(data?.items) ? data.items : [];
  return { reports: list.map(normalizeReport), total: Number(data?.total ?? list.length) };
}

/** `remove` deletes the content; both close every open report on it. */
export async function resolvePulseReport(
  reportId: string,
  action: "remove" | "dismiss",
  note?: string
): Promise<void> {
  await axios.patch(
    backendRoutes.pulse.adminReport(reportId),
    { action, ...(note?.trim() ? { note: note.trim() } : {}) },
    backendAxiosConfig()
  );
}

// ---------- Newsletter vs dashboard ----------

/** Same-origin route that Newsletter uses instead of the user's own admin login. */
const NEWSLETTER_BACKEND_PATH = "/api/newsletter/backend";

function onNewsletterPage() {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return path === "/newsletter" || path.startsWith("/newsletter/");
}

/**
 * Newsletter and News & Insight calls: on the standalone /newsletter page they go through its
 * proxy (its session cookie is checked on the server); in the admin
 * dashboard they use the signed-in admin's token as before.
 */
function contentConfig(multipart = false): AxiosRequestConfig {
  if (!onNewsletterPage()) return multipart ? backendMultipartAxiosConfig() : backendAxiosConfig();
  return {
    baseURL: NEWSLETTER_BACKEND_PATH,
    withCredentials: true,
    // Let axios set the multipart boundary itself
    headers: multipart ? {} : { "Content-Type": "application/json" },
  };
}

// ---------- News & Insight (admin) ----------

export async function fetchAdminNewsInsights(
  page = 1,
  limit = 30
): Promise<{ items: NewsInsightArticle[]; total: number }> {
  const { data } = await axios.get(backendRoutes.newsInsights.adminList, {
    ...contentConfig(),
    params: { page, limit },
  });
  const list = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.articles)
      ? data.articles
      : [];
  return { items: list.map(normalizeArticle), total: Number(data?.total ?? list.length) };
}

export type CreateNewsInsightInput = {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  publishedAt?: string;
  isPublished: boolean;
  notifySubscribers: boolean;
  thumbnailFile?: File | null;
  thumbnailUrl?: string;
  heroImageFile?: File | null;
  heroImageUrl?: string;
};

export async function createNewsInsight(input: CreateNewsInsightInput): Promise<NewsInsightArticle> {
  const optional = {
    ...(input.excerpt?.trim() ? { excerpt: input.excerpt.trim() } : {}),
    ...(input.slug?.trim() ? { slug: input.slug.trim() } : {}),
    ...(input.publishedAt ? { publishedAt: input.publishedAt } : {}),
  };

  // Files need multipart; otherwise plain JSON with image URLs
  if (input.thumbnailFile || input.heroImageFile) {
    const form = new FormData();
    form.append("title", input.title.trim());
    form.append("content", input.content);
    form.append("isPublished", String(input.isPublished));
    form.append("notifySubscribers", String(input.notifySubscribers));
    Object.entries(optional).forEach(([k, v]) => form.append(k, v));
    if (input.thumbnailFile) form.append("thumbnail", input.thumbnailFile);
    else if (input.thumbnailUrl) form.append("thumbnailURLUrl", input.thumbnailUrl.trim());
    if (input.heroImageFile) form.append("heroImage", input.heroImageFile);
    else if (input.heroImageUrl) form.append("heroImageURL", input.heroImageUrl.trim());
    const { data } = await axios.post(
      backendRoutes.newsInsights.adminCreate,
      form,
      contentConfig(true)
    );
    return normalizeArticle(data?.article ?? data);
  }

  const { data } = await axios.post(
    backendRoutes.newsInsights.adminCreate,
    {
      title: input.title.trim(),
      content: input.content,
      isPublished: input.isPublished,
      notifySubscribers: input.notifySubscribers,
      ...optional,
      ...(input.thumbnailUrl ? { thumbnailURLUrl: input.thumbnailUrl.trim() } : {}),
      ...(input.heroImageUrl ? { heroImageURL: input.heroImageUrl.trim() } : {}),
    },
    contentConfig()
  );
  return normalizeArticle(data?.article ?? data);
}

// ---------- Newsletter ----------

export type NewsletterDraft = { paste: string } | { title: string; content: string };

export type NewsletterPreview = {
  title: string;
  excerpt: string;
  newsletter: { subject: string; html: string };
  newsInsight: {
    title: string;
    excerpt: string;
    content: string;
    thumbnailUrl: string | null;
    heroImageUrl: string | null;
  };
};

export async function previewNewsletter(draft: NewsletterDraft): Promise<NewsletterPreview> {
  const { data } = await axios.post(backendRoutes.newsletter.preview, draft, contentConfig());
  const ni = data?.newsInsight ?? {};
  return {
    title: String(data?.title ?? ""),
    excerpt: String(data?.excerpt ?? ""),
    newsletter: {
      subject: String(data?.newsletter?.subject ?? data?.title ?? ""),
      html: String(data?.newsletter?.html ?? ""),
    },
    newsInsight: {
      title: String(ni.title ?? data?.title ?? ""),
      excerpt: String(ni.excerpt ?? ""),
      content: String(ni.content ?? ""),
      thumbnailUrl: ni.thumbnailURLUrl || null,
      heroImageUrl: ni.heroImageURL || null,
    },
  };
}

export type NewsletterRecipient =
  | "all"
  | "admin"
  | "super-admin"
  | "observer"
  | "volunteer"
  | "public-viewer";

export type SendNewsletterOptions = {
  isTest: boolean;
  testEmails?: string[];
  recipients?: NewsletterRecipient[] | "all";
  sendEmail?: boolean;
  publishAsNewsInsight: boolean;
  /** Lagos time, e.g. 2026-11-03T08:00 */
  scheduleTime?: string;
};

export type SendNewsletterResult = {
  message: string;
  totalRecipients?: number;
  emailSent?: boolean;
  newsInsightPublished?: boolean;
  notificationsSent?: boolean;
  scheduleTime?: string;
  newsInsightSlug?: string;
};

export async function sendNewsletter(
  draft: NewsletterDraft,
  options: SendNewsletterOptions
): Promise<SendNewsletterResult> {
  // No timeout: large lists are emailed in batches and can take minutes
  const { data } = await axios.post(
    backendRoutes.newsletter.send,
    { ...draft, ...options },
    { ...contentConfig(), timeout: 0 }
  );
  return {
    message: String(data?.message ?? "Done"),
    totalRecipients: data?.totalRecipients,
    emailSent: data?.emailSent,
    newsInsightPublished: data?.newsInsightPublished,
    notificationsSent: data?.notificationsSent,
    scheduleTime: data?.scheduleTime,
    newsInsightSlug: data?.newsInsight?.slug,
  };
}
