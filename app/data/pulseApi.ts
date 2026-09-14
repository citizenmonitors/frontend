import axios from "axios";
import backendAxiosConfig from "./axiosConfig";
import { backendRoutes } from "./backend";
import {
  CreatePulseCommentPayload,
  CreatePulsePostPayload,
  FetchPulsePostsParams,
  PulseAuthor,
  PulseComment,
  PulsePost,
  PulsePostsPage,
} from "../redux/types";

function normalizeAuthor(raw: Record<string, unknown> | undefined): PulseAuthor {
  const author = raw ?? {};
  return {
    id: String(author.id ?? ""),
    displayName: String(author.displayName ?? ""),
    usedAnonymous: Boolean(author.usedAnonymous),
  };
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

function normalizePost(raw: Record<string, unknown>): PulsePost {
  const imageUrl = raw.imageUrl ?? raw.imageURL ?? null;
  const location = normalizeLocation(raw);
  const locationLabel = normalizeLocationLabel(raw);

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
    isLikedByCurrentUser: Boolean(
      raw.isLikedByCurrentUser ?? raw.likedByMe ?? raw.liked ?? false
    ),
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
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
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
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
  nestedKey: "post" | "comment"
): { id: string; likesCount: number; isLikedByCurrentUser: boolean } {
  const record = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const nested = record[nestedKey];
  const source =
    nested && typeof nested === "object" ? (nested as Record<string, unknown>) : record;

  return {
    id: String(source.id ?? source._id ?? entityId),
    likesCount: Number(source.likesCount ?? 0),
    isLikedByCurrentUser: Boolean(source.isLikedByCurrentUser),
  };
}

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

export async function createPulsePost(
  payload: CreatePulsePostPayload
): Promise<PulsePost> {
  const formData = new FormData();
  formData.append("body", payload.body);
  formData.append("visibilityScope", payload.visibilityScope ?? "public");
  formData.append("useAnonymousDisplay", String(payload.useAnonymousDisplay));

  if (payload.image instanceof File) {
    formData.append("image", payload.image, payload.image.name);
  }

  const config = backendAxiosConfig({ type: "multipart/form-data" });
  if (config.headers && typeof config.headers === "object") {
    delete (config.headers as Record<string, string>)["Content-Type"];
  }

  const { data } = await axios.post(backendRoutes.pulse.createPost, formData, config);

  const post = extractRecord(data, "post");
  const source = post ?? (data as Record<string, unknown>);
  return normalizePost(source);
}

export async function togglePulsePostLike(postId: string): Promise<PulseLikeUpdate> {
  const { data } = await axios.post(
    backendRoutes.pulse.likePost(postId),
    {},
    backendAxiosConfig()
  );

  const fields = extractLikeFields(data, postId, "post");
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
  commentId: string
): Promise<PulseCommentLikeUpdate> {
  const { data } = await axios.post(
    backendRoutes.pulse.likeComment(postId, commentId),
    {},
    backendAxiosConfig()
  );

  const fields = extractLikeFields(data, commentId, "comment");
  return {
    commentId,
    likesCount: fields.likesCount,
    isLikedByCurrentUser: fields.isLikedByCurrentUser,
  };
}
