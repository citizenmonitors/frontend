import axios from "axios";
import backendAxiosConfig from "./axiosConfig";
import { backendRoutes } from "./backend";
import {
  CreatePulseCommentPayload,
  CreatePulsePostPayload,
  FetchPulsePostsParams,
  PulseAuthor,
  PulseBlock,
  PulseComment,
  PulsePost,
  PulsePostsPage,
  PulseReportReason,
} from "../redux/types";

function normalizeAuthor(raw: Record<string, unknown> | undefined): PulseAuthor {
  const author = raw ?? {};
  const avatar = author.avatarUrl;
  return {
    // null on anonymous content; never compare it to decide ownership
    id: author.id == null || author.id === "" ? null : String(author.id),
    displayName: String(author.displayName ?? ""),
    usedAnonymous: Boolean(author.usedAnonymous),
    avatarUrl: typeof avatar === "string" && avatar ? avatar : null,
  };
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

function normalizeLocationLabel(raw: Record<string, unknown>): string | null {
  const direct =
    raw.locationLabel ??
    raw.locationName ??
    raw.displayLocation ??
    raw.areaName ??
    raw.area;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const nested =
    raw.location && typeof raw.location === "object"
      ? (raw.location as Record<string, unknown>)
      : null;

  const parts = [
    nested?.pollingUnit ?? raw.pollingUnit ?? raw.pollingUnitName,
    nested?.ward ?? raw.ward ?? raw.wardName,
    nested?.lga ?? raw.lga ?? raw.lgaName,
    nested?.state ?? raw.state ?? raw.stateName,
  ]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);

  if (parts.length === 0) return null;
  // Prefer the most specific available label
  return parts[0];
}

function normalizeLocation(
  raw: Record<string, unknown>
): PulsePost["location"] {
  const nested =
    raw.location && typeof raw.location === "object"
      ? (raw.location as Record<string, unknown>)
      : {};

  const location = {
    state: String(nested.state ?? raw.state ?? "").trim() || undefined,
    lga: String(nested.lga ?? raw.lga ?? "").trim() || undefined,
    ward: String(nested.ward ?? raw.ward ?? "").trim() || undefined,
    pollingUnit: String(
      nested.pollingUnit ?? raw.pollingUnit ?? ""
    ).trim() || undefined,
  };

  if (!location.state && !location.lga && !location.ward && !location.pollingUnit) {
    return null;
  }
  return location;
}

function normalizeQuotedPost(
  raw: Record<string, unknown> | null | undefined
): PulsePost["quotedPost"] {
  if (!raw || typeof raw !== "object") return null;
  const imageUrl = raw.imageUrl ?? raw.imageURL ?? null;
  return {
    id: String(raw.id ?? raw._id ?? ""),
    body: String(raw.body ?? raw.content ?? ""),
    imageUrl: typeof imageUrl === "string" && imageUrl.length > 0 ? imageUrl : null,
    author: normalizeAuthor(raw.author as Record<string, unknown> | undefined),
    locationLabel:
      typeof raw.locationLabel === "string" ? raw.locationLabel : null,
    createdAt: raw.createdAt as string | undefined,
    isQuote: Boolean(raw.isQuote),
    unavailable: Boolean(raw.unavailable),
    isOwnedByCurrentUser: Boolean(raw.isOwnedByCurrentUser),
  };
}

export function normalizePost(raw: Record<string, unknown>): PulsePost {
  const imageUrl = raw.imageUrl ?? raw.imageURL ?? null;
  const location = normalizeLocation(raw);
  const locationLabel = normalizeLocationLabel(raw);
  const quotedRaw =
    (raw.quotedPost as Record<string, unknown> | undefined) ||
    (raw.repostOf as Record<string, unknown> | undefined) ||
    (raw.originalPost as Record<string, unknown> | undefined) ||
    null;

  return {
    id: String(raw.id ?? raw._id ?? ""),
    body: String(raw.body ?? raw.content ?? ""),
    imageUrl: typeof imageUrl === "string" && imageUrl.length > 0 ? imageUrl : null,
    visibilityScope: String(raw.visibilityScope ?? "public"),
    locationLabel,
    location,
    author: normalizeAuthor(raw.author as Record<string, unknown> | undefined),
    likesCount: Number(raw.likesCount ?? 0),
    commentsCount: Number(raw.commentsCount ?? 0),
    repostsCount: Number(raw.repostCount ?? raw.repostsCount ?? 0),
    quoteCount: Number(raw.quoteCount ?? 0),
    isLikedByCurrentUser: Boolean(
      raw.isLikedByCurrentUser ?? raw.likedByMe ?? raw.liked ?? false
    ),
    isOwnedByCurrentUser: Boolean(raw.isOwnedByCurrentUser),
    isRepostedByCurrentUser: Boolean(raw.isRepostedByCurrentUser),
    isRepost: Boolean(raw.isRepost),
    // Older API builds don't send isQuote: a repost with text is a quote
    isQuote:
      raw.isQuote != null
        ? Boolean(raw.isQuote)
        : Boolean(raw.isRepost) && String(raw.body ?? "").trim() !== "",
    quotedPost: normalizeQuotedPost(quotedRaw),
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
    editedAt: optionalString(raw.editedAt),
  };
}

function normalizeComment(raw: Record<string, unknown>, postId?: string): PulseComment {
  return {
    id: String(raw.id ?? raw._id ?? ""),
    postId: String(raw.postId ?? postId ?? ""),
    body: String(raw.body ?? raw.content ?? ""),
    author: normalizeAuthor(raw.author as Record<string, unknown> | undefined),
    likesCount: Number(raw.likesCount ?? 0),
    isLikedByCurrentUser: Boolean(
      raw.isLikedByCurrentUser ?? raw.likedByMe ?? raw.liked ?? false
    ),
    isOwnedByCurrentUser: Boolean(raw.isOwnedByCurrentUser),
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
    editedAt: optionalString(raw.editedAt),
  };
}

export type PulseLikeUpdate = {
  postId: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
};

export type PulseCommentLikeUpdate = {
  commentId: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
};

function extractLikeFields(
  data: unknown,
  entityId: string,
  nestedKey: "post" | "comment",
  fallback?: { liked: boolean; count: number }
): { id: string; likesCount: number; isLikedByCurrentUser: boolean } {
  const record = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const nested = record[nestedKey];
  const source =
    nested && typeof nested === "object" ? (nested as Record<string, unknown>) : record;

  // Unlike (DELETE) may return no counts; fall back to the expected result.
  const expectedLiked = fallback ? !fallback.liked : false;
  const expectedCount = fallback
    ? Math.max(0, fallback.count + (fallback.liked ? -1 : 1))
    : 0;
  return {
    id: String(source.id ?? source._id ?? entityId),
    likesCount:
      source.likesCount != null ? Number(source.likesCount) : expectedCount,
    isLikedByCurrentUser:
      source.isLikedByCurrentUser != null
        ? Boolean(source.isLikedByCurrentUser)
        : expectedLiked,
  };
}

export type PulseLikeState = { liked: boolean; count: number };

function extractRecord(data: unknown, key: string): Record<string, unknown> | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (record[key] && typeof record[key] === "object") {
    return record[key] as Record<string, unknown>;
  }
  return null;
}

export async function fetchPulsePosts(
  params: FetchPulsePostsParams = {}
): Promise<PulsePostsPage> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  const { data } = await axios.get(backendRoutes.pulse.getPosts, {
    ...backendAxiosConfig(),
    params: { page, limit },
  });

  const posts = Array.isArray((data as PulsePostsPage)?.posts)
    ? (data as PulsePostsPage).posts.map((post) =>
        normalizePost(post as unknown as Record<string, unknown>)
      )
    : [];

  return {
    posts,
    total: Number((data as PulsePostsPage)?.total ?? posts.length),
    page: Number((data as PulsePostsPage)?.page ?? page),
    limit: Number((data as PulsePostsPage)?.limit ?? limit),
  };
}

/** A created post plus the server's warning when its image couldn't be stored. */
export type PulseCreateResult = PulsePost & { uploadWarning?: string };

function multipartConfig() {
  const config = backendAxiosConfig({ type: "multipart/form-data" });
  if (config.headers && typeof config.headers === "object") {
    delete (config.headers as Record<string, string>)["Content-Type"];
  }
  return config;
}

function readPostResponse(data: unknown): { post: PulsePost; warning?: string } {
  const record = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const source = extractRecord(data, "post") ?? record;
  const warning = typeof record.warning === "string" ? record.warning : undefined;
  return { post: normalizePost(source), warning };
}

/**
 * Creates a post. With `quotePostId` it posts a quote of that post instead
 * (POST /posts/:id/repost with a body). Plain reposts use `repostPulsePost`.
 */
export async function createPulsePost(
  payload: CreatePulsePostPayload
): Promise<PulseCreateResult> {
  const formData = new FormData();
  formData.append("body", payload.body.trim());
  formData.append("visibilityScope", payload.visibilityScope ?? "public");
  formData.append("useAnonymousDisplay", String(payload.useAnonymousDisplay));
  if (payload.locationLabel) {
    formData.append("locationLabel", payload.locationLabel);
  }
  if (payload.image instanceof File) {
    formData.append("image", payload.image, payload.image.name);
  }

  const url = payload.quotePostId
    ? backendRoutes.pulse.repost(payload.quotePostId)
    : backendRoutes.pulse.createPost;
  const { data } = await axios.post(url, formData, multipartConfig());
  const { post, warning } = readPostResponse(data);

  return {
    ...post,
    quotedPost: post.quotedPost || payload.quotedPost || null,
    isQuote: post.isQuote || Boolean(payload.quotePostId),
    isRepost: post.isRepost || Boolean(payload.quotePostId),
    isOwnedByCurrentUser: true,
    location: post.location || payload.location || null,
    visibilityScope: payload.visibilityScope || post.visibilityScope,
    locationLabel: payload.locationLabel || post.locationLabel || null,
    uploadWarning: warning,
  };
}

/** Plain repost (no body). One per user per post; a second returns 409. */
export async function repostPulsePost(postId: string): Promise<PulsePost> {
  const { data } = await axios.post(
    backendRoutes.pulse.repost(postId),
    {},
    backendAxiosConfig()
  );
  return { ...readPostResponse(data).post, isOwnedByCurrentUser: true };
}

export async function undoPulseRepost(postId: string): Promise<void> {
  await axios.delete(backendRoutes.pulse.repost(postId), backendAxiosConfig());
}

export async function fetchPulsePost(postId: string): Promise<PulsePost> {
  const { data } = await axios.get(backendRoutes.pulse.post(postId), backendAxiosConfig());
  return readPostResponse(data).post;
}

export type UpdatePulsePostPayload = {
  body?: string;
  visibilityScope?: string;
  useAnonymousDisplay?: boolean;
  image?: File | null;
  removeImage?: boolean;
};

export async function updatePulsePost(
  postId: string,
  payload: UpdatePulsePostPayload
): Promise<PulseCreateResult> {
  const formData = new FormData();
  if (payload.body !== undefined) formData.append("body", payload.body.trim());
  if (payload.visibilityScope) formData.append("visibilityScope", payload.visibilityScope);
  if (payload.useAnonymousDisplay !== undefined) {
    formData.append("useAnonymousDisplay", String(payload.useAnonymousDisplay));
  }
  if (payload.removeImage) formData.append("removeImage", "true");
  if (payload.image instanceof File) {
    formData.append("image", payload.image, payload.image.name);
  }
  const { data } = await axios.patch(
    backendRoutes.pulse.post(postId),
    formData,
    multipartConfig()
  );
  const { post, warning } = readPostResponse(data);
  return { ...post, uploadWarning: warning };
}

export async function deletePulsePost(postId: string): Promise<void> {
  await axios.delete(backendRoutes.pulse.post(postId), backendAxiosConfig());
}

export async function reportPulsePost(
  postId: string,
  reason: PulseReportReason,
  details?: string
): Promise<void> {
  await axios.post(
    backendRoutes.pulse.reportPost(postId),
    { reason, ...(details?.trim() ? { details: details.trim() } : {}) },
    backendAxiosConfig()
  );
}

/** Fields an edit can change. Send at least one; 400 if nothing changes. */
export type CommentChanges = { body?: string; useAnonymousDisplay?: boolean };

function commentChangesPayload(changes: CommentChanges) {
  return {
    ...(changes.body !== undefined ? { body: changes.body.trim() } : {}),
    ...(changes.useAnonymousDisplay !== undefined
      ? { useAnonymousDisplay: changes.useAnonymousDisplay }
      : {}),
  };
}

export async function updatePulseComment(
  postId: string,
  commentId: string,
  changes: CommentChanges
): Promise<PulseComment> {
  const { data } = await axios.patch(
    backendRoutes.pulse.comment(postId, commentId),
    commentChangesPayload(changes),
    backendAxiosConfig()
  );
  const source = extractRecord(data, "comment") ?? (data as Record<string, unknown>);
  return normalizeComment(source, postId);
}

export async function deletePulseComment(postId: string, commentId: string): Promise<void> {
  await axios.delete(backendRoutes.pulse.comment(postId, commentId), backendAxiosConfig());
}

export async function reportPulseComment(
  postId: string,
  commentId: string,
  reason: PulseReportReason,
  details?: string
): Promise<void> {
  await axios.post(
    backendRoutes.pulse.reportComment(postId, commentId),
    { reason, ...(details?.trim() ? { details: details.trim() } : {}) },
    backendAxiosConfig()
  );
}

export async function fetchPulseBlocks(): Promise<PulseBlock[]> {
  const { data } = await axios.get(backendRoutes.pulse.blocks, backendAxiosConfig());
  const list = Array.isArray((data as { blocks?: unknown[] })?.blocks)
    ? (data as { blocks: Record<string, unknown>[] }).blocks
    : [];
  return list.map((b) => ({
    id: String(b.id ?? b._id ?? ""),
    displayName: String(b.displayName ?? "Citizen"),
    blockedAt: b.blockedAt as string | undefined,
  }));
}

/** Blocks the author of a post or comment (works for anonymous authors too). */
export async function blockPulseAuthor(
  target: { postId: string } | { commentId: string }
): Promise<PulseBlock> {
  const { data } = await axios.post(backendRoutes.pulse.blocks, target, backendAxiosConfig());
  const block = extractRecord(data, "block") ?? {};
  return {
    id: String(block.id ?? ""),
    displayName: String(block.displayName ?? "Citizen"),
    blockedAt: block.blockedAt as string | undefined,
  };
}

export async function unblockPulseUser(blockId: string): Promise<void> {
  await axios.delete(backendRoutes.pulse.block(blockId), backendAxiosConfig());
}

/** Likes, or unlikes when `currentlyLiked` (DELETE is safe to repeat). */
export async function togglePulsePostLike(
  postId: string,
  current?: PulseLikeState
): Promise<PulseLikeUpdate> {
  const { data } = current?.liked
    ? await axios.delete(backendRoutes.pulse.likePost(postId), backendAxiosConfig())
    : await axios.post(backendRoutes.pulse.likePost(postId), {}, backendAxiosConfig());

  const fields = extractLikeFields(data, postId, "post", current);
  return {
    postId,
    likesCount: fields.likesCount,
    isLikedByCurrentUser: fields.isLikedByCurrentUser,
  };
}

export async function fetchPulseComments(postId: string): Promise<PulseComment[]> {
  const { data } = await axios.get(
    backendRoutes.pulse.getComments(postId),
    backendAxiosConfig()
  );

  const comments = Array.isArray((data as { comments?: unknown[] })?.comments)
    ? (data as { comments: Record<string, unknown>[] }).comments
    : [];

  return comments.map((comment) => normalizeComment(comment, postId));
}

export async function createPulseComment(
  payload: CreatePulseCommentPayload
): Promise<PulseComment> {
  const { data } = await axios.post(
    backendRoutes.pulse.createComment(payload.postId),
    {
      body: payload.body,
      useAnonymousDisplay: payload.useAnonymousDisplay ?? false,
    },
    backendAxiosConfig()
  );

  const comment = extractRecord(data, "comment");
  const source = comment ?? (data as Record<string, unknown>);
  return normalizeComment(source, payload.postId);
}

export async function togglePulseCommentLike(
  postId: string,
  commentId: string,
  current?: PulseLikeState
): Promise<PulseCommentLikeUpdate> {
  const url = backendRoutes.pulse.likeComment(postId, commentId);
  const { data } = current?.liked
    ? await axios.delete(url, backendAxiosConfig())
    : await axios.post(url, {}, backendAxiosConfig());

  const fields = extractLikeFields(data, commentId, "comment", current);
  return {
    commentId,
    likesCount: fields.likesCount,
    isLikedByCurrentUser: fields.isLikedByCurrentUser,
  };
}
