import axios from "axios";
import backendAxiosConfig from "./axiosConfig";
import { backendRoutes } from "./backend";
import {
  CreateElectionDiscussionCommentPayload,
  CreateElectionDiscussionPostPayload,
  ElectionDiscussionComment,
  ElectionDiscussionPost,
  ElectionDiscussionPostsPage,
  FetchElectionDiscussionPostsParams,
  PulseAuthor,
} from "../redux/types";

function normalizeAuthor(raw: Record<string, unknown> | undefined): PulseAuthor {
  const author = raw ?? {};
  return {
    id: String(author.id ?? ""),
    displayName: String(author.displayName ?? ""),
    usedAnonymous: Boolean(author.usedAnonymous),
  };
}

function normalizeMediaUrls(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const url = record.url ?? record.imageUrl ?? record.videoUrl;
        return typeof url === "string" ? url : "";
      }
      return "";
    })
    .filter(Boolean);
}

function normalizePost(raw: Record<string, unknown>): ElectionDiscussionPost {
  const singleImage = raw.imageUrl ?? raw.imageURL;
  const imageUrls = normalizeMediaUrls(raw.imageUrls ?? raw.images ?? raw.pictures);
  if (typeof singleImage === "string" && singleImage.length > 0) {
    imageUrls.unshift(singleImage);
  }

  return {
    id: String(raw.id ?? raw._id ?? ""),
    body: String(raw.body ?? raw.content ?? ""),
    imageUrls: [...new Set(imageUrls)],
    videoUrls: normalizeMediaUrls(raw.videoUrls ?? raw.videos),
    allowSocialShare: Boolean(raw.allowSocialShare),
    author: normalizeAuthor(raw.author as Record<string, unknown> | undefined),
    likesCount: Number(raw.likesCount ?? 0),
    commentsCount: Number(raw.commentsCount ?? 0),
    sharesCount: Number(raw.sharesCount ?? 0),
    isLikedByCurrentUser: Boolean(
      raw.isLikedByCurrentUser ?? raw.likedByMe ?? raw.liked ?? false
    ),
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

function normalizeComment(
  raw: Record<string, unknown>,
  postId?: string
): ElectionDiscussionComment {
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

export type ElectionDiscussionLikeUpdate = {
  postId: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
};

export type ElectionDiscussionCommentLikeUpdate = {
  commentId: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
};

function extractLikeFields(
  data: unknown,
  entityId: string,
  nestedKey: "post" | "comment"
): { likesCount: number; isLikedByCurrentUser: boolean } {
  const record = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const nested = record[nestedKey];
  const source =
    nested && typeof nested === "object" ? (nested as Record<string, unknown>) : record;

  return {
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

export async function fetchElectionDiscussionPosts(
  params: FetchElectionDiscussionPostsParams
): Promise<ElectionDiscussionPostsPage> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const { activeElectionId } = params;

  const { data } = await axios.get(
    backendRoutes.dashboard.elections.getDiscussionPosts(activeElectionId),
    {
      ...backendAxiosConfig(),
      params: { page, limit },
    }
  );

  const posts = Array.isArray((data as ElectionDiscussionPostsPage)?.posts)
    ? (data as ElectionDiscussionPostsPage).posts.map((post) =>
        normalizePost(post as unknown as Record<string, unknown>)
      )
    : [];

  return {
    posts,
    total: Number((data as ElectionDiscussionPostsPage)?.total ?? posts.length),
    page: Number((data as ElectionDiscussionPostsPage)?.page ?? page),
    limit: Number((data as ElectionDiscussionPostsPage)?.limit ?? limit),
  };
}

export async function createElectionDiscussionPost(
  payload: CreateElectionDiscussionPostPayload
): Promise<ElectionDiscussionPost> {
  const { images = [], videos = [], activeElectionId } = payload;
  const hasMedia = images.length > 0 || videos.length > 0;

  if (!hasMedia) {
    const { data } = await axios.post(
      backendRoutes.dashboard.elections.createDiscussionPost(activeElectionId),
      {
        body: payload.body,
        allowSocialShare: payload.allowSocialShare,
        useAnonymousDisplay: payload.useAnonymousDisplay,
      },
      backendAxiosConfig()
    );

    const post = extractRecord(data, "post");
    const source = post ?? (data as Record<string, unknown>);
    return normalizePost(source);
  }

  const formData = new FormData();
  formData.append("body", payload.body);
  formData.append("allowSocialShare", String(payload.allowSocialShare));
  formData.append("useAnonymousDisplay", String(payload.useAnonymousDisplay));
  images.forEach((file) => formData.append("images[]", file, file.name));
  videos.forEach((file) => formData.append("videos[]", file, file.name));

  const config = backendAxiosConfig({ type: "multipart/form-data" });
  if (config.headers && typeof config.headers === "object") {
    delete (config.headers as Record<string, string>)["Content-Type"];
  }

  const { data } = await axios.post(
    backendRoutes.dashboard.elections.createDiscussionPost(activeElectionId),
    formData,
    config
  );

  const post = extractRecord(data, "post");
  const source = post ?? (data as Record<string, unknown>);
  return normalizePost(source);
}

export async function toggleElectionDiscussionPostLike(
  activeElectionId: string,
  postId: string
): Promise<ElectionDiscussionLikeUpdate> {
  const { data } = await axios.post(
    backendRoutes.dashboard.elections.likeDiscussionPost(activeElectionId, postId),
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

export async function fetchElectionDiscussionComments(
  activeElectionId: string,
  postId: string
): Promise<ElectionDiscussionComment[]> {
  const { data } = await axios.get(
    backendRoutes.dashboard.elections.getDiscussionComments(activeElectionId, postId),
    backendAxiosConfig()
  );

  const comments = Array.isArray((data as { comments?: unknown[] })?.comments)
    ? (data as { comments: Record<string, unknown>[] }).comments
    : [];

  return comments.map((comment) => normalizeComment(comment, postId));
}

export async function createElectionDiscussionComment(
  payload: CreateElectionDiscussionCommentPayload
): Promise<ElectionDiscussionComment> {
  const { data } = await axios.post(
    backendRoutes.dashboard.elections.createDiscussionComment(
      payload.activeElectionId,
      payload.postId
    ),
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

export async function toggleElectionDiscussionCommentLike(
  activeElectionId: string,
  postId: string,
  commentId: string
): Promise<ElectionDiscussionCommentLikeUpdate> {
  const { data } = await axios.post(
    backendRoutes.dashboard.elections.likeDiscussionComment(
      activeElectionId,
      postId,
      commentId
    ),
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
