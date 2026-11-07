import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  blockPulseAuthor,
  createPulseComment as createPulseCommentRequest,
  createPulsePost as createPulsePostRequest,
  deletePulseComment as deletePulseCommentRequest,
  deletePulsePost as deletePulsePostRequest,
  fetchPulseComments,
  fetchPulsePosts,
  PulseCommentLikeUpdate,
  PulseCreateResult,
  PulseLikeUpdate,
  reportPulseComment as reportPulseCommentRequest,
  reportPulsePost as reportPulsePostRequest,
  repostPulsePost as repostPulsePostRequest,
  togglePulseCommentLike as togglePulseCommentLikeRequest,
  togglePulsePostLike as togglePulsePostLikeRequest,
  undoPulseRepost as undoPulseRepostRequest,
  updatePulseComment as updatePulseCommentRequest,
  updatePulsePost as updatePulsePostRequest,
  UpdatePulsePostPayload,
  CommentChanges,
} from "@/app/data/pulseApi";
import handleStateError from "../helpers/handleStateError";
import fetchInThunk from "../helpers/fetchInThunk";
import {
  CreatePulseCommentPayload,
  CreatePulsePostPayload,
  FetchPulsePostsParams,
  FetchState,
  PulseComment,
  PulsePost,
  PulsePostsPage,
  PulseReportReason,
} from "../types";

/** Prefer serving localStorage cache; only hit the API after this window. */
export const PULSE_FEED_STALE_MS = 30 * 60 * 1000; // 30 minutes
/** Drop localStorage entries older than this. */
export const PULSE_FEED_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
/** After a failed fetch (e.g. 429), wait before trying again. */
export const PULSE_FEED_RETRY_BACKOFF_MS = 60 * 1000; // 1 minute

const PULSE_FEED_CACHE_KEY = "citimoni.pulse.feed.v2";
const PULSE_FEED_CACHE_KEY_LEGACY = "citimoni.pulse.feed.v1";
const PULSE_FEED_BACKOFF_KEY = "citimoni.pulse.feed.backoff";

type PulseFeedCache = {
  posts: PulsePost[];
  total: number;
  page: number;
  limit: number;
  postsFetchedAt: number;
};

type PulseState = {
  posts: PulsePost[];
  comments: PulseComment[];
  activePostId: string | null;
  total: number;
  page: number;
  limit: number;
  /** Epoch ms when posts were last fetched successfully */
  postsFetchedAt: number | null;
  /** Epoch ms of last failed getPosts (used for 429 backoff) */
  lastFetchErrorAt: number | null;
  status: {
    getPosts: FetchState;
    createPost: FetchState;
    likePost: FetchState;
    getComments: FetchState;
    createComment: FetchState;
    likeComment: FetchState;
  };
  error: {
    message: string | null;
  };
  /** Server warning from the last create (e.g. image couldn't be uploaded) */
  lastCreateWarning?: string | null;
};

/** Plain repost (not a quote) of `originalId`. */
function isPlainRepostOf(post: PulsePost, originalId: string) {
  return (
    post.quotedPost?.id === originalId &&
    (post.isRepost ? !post.isQuote : !(post.body || "").trim())
  );
}

/** Drop a post plus plain reposts of it; quotes of it show "unavailable". */
function removePostFromFeed(state: PulseState, postId: string) {
  const before = state.posts.length;
  state.posts = state.posts
    .filter((post) => post.id !== postId && !isPlainRepostOf(post, postId))
    .map((post) =>
      post.quotedPost?.id === postId
        ? { ...post, quotedPost: { ...post.quotedPost, unavailable: true } }
        : post
    );
  state.total = Math.max(0, state.total - (before - state.posts.length));
}

/** Prevents Strict Mode / rapid remounts from firing parallel GETs. */
let pulsePostsInFlight = false;

function getPulseStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readPulseFeedCache(): PulseFeedCache | null {
  const storage = getPulseStorage();
  if (!storage) return null;
  try {
    let raw = storage.getItem(PULSE_FEED_CACHE_KEY);
    if (!raw) {
      // Migrate short-lived session cache if present
      try {
        raw =
          sessionStorage.getItem(PULSE_FEED_CACHE_KEY_LEGACY) ||
          storage.getItem(PULSE_FEED_CACHE_KEY_LEGACY);
        if (raw) {
          storage.setItem(PULSE_FEED_CACHE_KEY, raw);
          sessionStorage.removeItem(PULSE_FEED_CACHE_KEY_LEGACY);
          storage.removeItem(PULSE_FEED_CACHE_KEY_LEGACY);
        }
      } catch {
        // ignore migrate failures
      }
    }
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PulseFeedCache>;
    if (
      !parsed ||
      typeof parsed.postsFetchedAt !== "number" ||
      !Array.isArray(parsed.posts)
    ) {
      return null;
    }
    if (Date.now() - parsed.postsFetchedAt >= PULSE_FEED_MAX_AGE_MS) {
      storage.removeItem(PULSE_FEED_CACHE_KEY);
      return null;
    }
    return {
      posts: parsed.posts,
      total: Number(parsed.total ?? parsed.posts.length),
      page: Number(parsed.page ?? 1),
      limit: Number(parsed.limit ?? 20),
      postsFetchedAt: parsed.postsFetchedAt,
    };
  } catch {
    return null;
  }
}

function writePulseFeedCache(state: PulseState) {
  const storage = getPulseStorage();
  if (!storage || state.postsFetchedAt == null) return;
  try {
    const payload: PulseFeedCache = {
      posts: state.posts,
      total: state.total,
      page: state.page,
      limit: state.limit,
      postsFetchedAt: state.postsFetchedAt,
    };
    storage.setItem(PULSE_FEED_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota / private-mode failures
  }
}

function clearPulseFeedCache() {
  const storage = getPulseStorage();
  if (!storage) return;
  try {
    storage.removeItem(PULSE_FEED_CACHE_KEY);
    storage.removeItem(PULSE_FEED_CACHE_KEY_LEGACY);
    storage.removeItem(PULSE_FEED_BACKOFF_KEY);
    sessionStorage.removeItem(PULSE_FEED_CACHE_KEY_LEGACY);
  } catch {
    // ignore
  }
}

/** True when feed was fetched recently enough to skip the network. */
export function isPulseFeedFresh(postsFetchedAt: number | null | undefined) {
  return (
    postsFetchedAt != null && Date.now() - postsFetchedAt < PULSE_FEED_STALE_MS
  );
}

function readFetchBackoffAt(): number | null {
  const storage = getPulseStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(PULSE_FEED_BACKOFF_KEY);
    if (!raw) return null;
    const at = Number(raw);
    if (!Number.isFinite(at)) return null;
    if (Date.now() - at >= PULSE_FEED_RETRY_BACKOFF_MS) {
      storage.removeItem(PULSE_FEED_BACKOFF_KEY);
      return null;
    }
    return at;
  } catch {
    return null;
  }
}

function writeFetchBackoffAt(at: number) {
  const storage = getPulseStorage();
  if (!storage) return;
  try {
    storage.setItem(PULSE_FEED_BACKOFF_KEY, String(at));
  } catch {
    // ignore
  }
}

function clearFetchBackoff() {
  const storage = getPulseStorage();
  if (!storage) return;
  try {
    storage.removeItem(PULSE_FEED_BACKOFF_KEY);
  } catch {
    // ignore
  }
}

function isWithinFetchBackoff(lastFetchErrorAt: number | null | undefined) {
  const fromState =
    lastFetchErrorAt != null &&
    Date.now() - lastFetchErrorAt < PULSE_FEED_RETRY_BACKOFF_MS;
  if (fromState) return true;
  return readFetchBackoffAt() != null;
}

const initialState: PulseState = {
  posts: [],
  comments: [],
  activePostId: null,
  total: 0,
  page: 1,
  limit: 20,
  postsFetchedAt: null,
  lastFetchErrorAt: null,
  status: {
    getPosts: "not started",
    createPost: "not started",
    likePost: "not started",
    getComments: "not started",
    createComment: "not started",
    likeComment: "not started",
  },
  error: {
    message: null,
  },
};

const pulseSlice = createSlice({
  name: "pulse",
  initialState,
  reducers: {
    clearPulse() {
      clearPulseFeedCache();
      pulsePostsInFlight = false;
      return {
        posts: [],
        comments: [],
        activePostId: null,
        total: 0,
        page: 1,
        limit: 20,
        postsFetchedAt: null,
        lastFetchErrorAt: null,
        status: {
          getPosts: "not started",
          createPost: "not started",
          likePost: "not started",
          getComments: "not started",
          createComment: "not started",
          likeComment: "not started",
        },
        error: {
          message: null,
        },
      };
    },
    /** Restore feed from localStorage (client-only; works for guests too). */
    hydratePulseFeedFromCache(state) {
      const backoff = readFetchBackoffAt();
      if (backoff) state.lastFetchErrorAt = backoff;

      if (state.posts.length > 0 && isPulseFeedFresh(state.postsFetchedAt)) {
        return;
      }
      const cached = readPulseFeedCache();
      if (!cached) return;
      // Keep showing cached posts even when stale (stale-while-revalidate)
      state.posts = cached.posts;
      state.total = cached.total;
      state.page = cached.page;
      state.limit = cached.limit;
      state.postsFetchedAt = cached.postsFetchedAt;
      state.status.getPosts = "fulfilled";
    },
    setActivePostId(state, action: { payload: string | null }) {
      state.activePostId = action.payload;
    },
    clearPulseComments(state) {
      state.comments = [];
      state.activePostId = null;
    },
    clearCreatePostStatus(state) {
      state.status.createPost = "not started";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPulsePosts.pending, (state) => {
      state.status.getPosts = "pending";
    });
    builder.addCase(getPulsePosts.fulfilled, (state, action) => {
      pulsePostsInFlight = false;
      state.status.getPosts = "fulfilled";

      const incoming = Array.isArray(action.payload?.posts)
        ? action.payload.posts.filter((post) => post && post.id)
        : [];
      // Keep just-created posts that the list API has not returned yet (≤60s)
      const missingLocal = state.posts.filter((local) => {
        if (!local.id || incoming.some((p) => p.id === local.id)) return false;
        if (!local.createdAt) return true;
        const age = Date.now() - new Date(local.createdAt).getTime();
        return age >= 0 && age < 60_000;
      });
      state.posts = missingLocal.length
        ? [...missingLocal, ...incoming]
        : incoming;

      state.total = Math.max(action.payload.total, state.posts.length);
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.postsFetchedAt = Date.now();
      state.lastFetchErrorAt = null;
      clearFetchBackoff();
      writePulseFeedCache(state);
    });
    builder.addCase(getPulsePosts.rejected, (state, action: any) => {
      pulsePostsInFlight = false;
      const at = Date.now();
      state.lastFetchErrorAt = at;
      writeFetchBackoffAt(at);
      // Keep cached posts; avoid hammering the API after 429 / network errors
      state.status.getPosts =
        state.posts.length > 0 ? "fulfilled" : "rejected";
      handleStateError(state, action);
    });

    builder.addCase(createPulsePost.pending, (state) => {
      state.status.createPost = "pending";
      state.lastCreateWarning = null;
    });
    builder.addCase(createPulsePost.fulfilled, (state, action) => {
      state.status.createPost = "fulfilled";
      const { uploadWarning, ...created } = action.payload;
      state.lastCreateWarning = uploadWarning ?? null;
      const quoted = action.meta.arg.quotedPost || created.quotedPost;
      const nextPost = {
        ...created,
        quotedPost: quoted || created.quotedPost || null,
        location: created.location || action.meta.arg.location || null,
        visibilityScope:
          created.visibilityScope ||
          action.meta.arg.visibilityScope ||
          "public",
        locationLabel:
          created.locationLabel ||
          action.meta.arg.locationLabel ||
          null,
      };
      state.posts = [nextPost, ...state.posts];
      state.total += 1;
      state.postsFetchedAt = Date.now();

      if (quoted?.id && action.meta.arg.quotePostId) {
        state.posts = state.posts.map((post) =>
          post.id === quoted.id
            ? { ...post, quoteCount: (post.quoteCount || 0) + 1 }
            : post
        );
      }
      writePulseFeedCache(state);
    });
    builder.addCase(createPulsePost.rejected, (state, action: any) => {
      state.status.createPost = "rejected";
      handleStateError(state, action);
    });

    builder.addCase(togglePulsePostLike.pending, (state) => {
      state.status.likePost = "pending";
    });
    builder.addCase(togglePulsePostLike.fulfilled, (state, action) => {
      state.status.likePost = "fulfilled";
      state.posts = state.posts.map((post) =>
        post.id === action.payload.postId
          ? {
              ...post,
              likesCount: action.payload.likesCount,
              isLikedByCurrentUser: action.payload.isLikedByCurrentUser,
            }
          : post
      );
      writePulseFeedCache(state);
    });
    builder.addCase(togglePulsePostLike.rejected, (state, action: any) => {
      state.status.likePost = "rejected";
      handleStateError(state, action);
    });

    builder.addCase(getPulseComments.pending, (state) => {
      state.status.getComments = "pending";
    });
    builder.addCase(getPulseComments.fulfilled, (state, action) => {
      state.status.getComments = "fulfilled";
      state.comments = action.payload.comments;
      state.activePostId = action.payload.postId;
    });
    builder.addCase(getPulseComments.rejected, (state, action: any) => {
      state.status.getComments = "rejected";
      handleStateError(state, action);
    });

    builder.addCase(createPulseComment.pending, (state) => {
      state.status.createComment = "pending";
    });
    builder.addCase(createPulseComment.fulfilled, (state, action) => {
      state.status.createComment = "fulfilled";
      state.comments = [...state.comments, action.payload];
      state.posts = state.posts.map((post) =>
        post.id === action.payload.postId
          ? { ...post, commentsCount: post.commentsCount + 1 }
          : post
      );
      writePulseFeedCache(state);
    });
    builder.addCase(createPulseComment.rejected, (state, action: any) => {
      state.status.createComment = "rejected";
      handleStateError(state, action);
    });

    builder.addCase(togglePulseCommentLike.pending, (state) => {
      state.status.likeComment = "pending";
    });
    builder.addCase(togglePulseCommentLike.fulfilled, (state, action) => {
      state.status.likeComment = "fulfilled";
      state.comments = state.comments.map((comment) =>
        comment.id === action.payload.commentId
          ? {
              ...comment,
              likesCount: action.payload.likesCount,
              isLikedByCurrentUser: action.payload.isLikedByCurrentUser,
            }
          : comment
      );
    });
    builder.addCase(togglePulseCommentLike.rejected, (state, action: any) => {
      state.status.likeComment = "rejected";
      handleStateError(state, action);
    });

    builder.addCase(repostPulsePost.fulfilled, (state, action) => {
      const originalId = action.meta.arg;
      state.posts = state.posts.map((post) =>
        post.id === originalId
          ? {
              ...post,
              isRepostedByCurrentUser: true,
              repostsCount: (post.repostsCount || 0) + 1,
            }
          : post
      );
      const repost = action.payload;
      if (repost?.id && !state.posts.some((p) => p.id === repost.id)) {
        const original = state.posts.find((p) => p.id === originalId);
        state.posts = [
          {
            ...repost,
            isRepost: true,
            isQuote: false,
            quotedPost:
              repost.quotedPost ||
              (original
                ? {
                    id: original.id,
                    body: original.body,
                    imageUrl: original.imageUrl,
                    author: original.author,
                    createdAt: original.createdAt,
                    locationLabel: original.locationLabel,
                  }
                : null),
          },
          ...state.posts,
        ];
        state.total += 1;
      }
      writePulseFeedCache(state);
    });
    builder.addCase(undoPulseRepost.fulfilled, (state, action) => {
      const originalId = action.payload;
      state.posts = state.posts
        .filter(
          (post) => !(post.isOwnedByCurrentUser && isPlainRepostOf(post, originalId))
        )
        .map((post) =>
          post.id === originalId
            ? {
                ...post,
                isRepostedByCurrentUser: false,
                repostsCount: Math.max(0, (post.repostsCount || 0) - 1),
              }
            : post
        );
      writePulseFeedCache(state);
    });
    builder.addCase(updatePulsePost.fulfilled, (state, action) => {
      const { uploadWarning: _warning, ...updated } = action.payload;
      state.posts = state.posts.map((post) =>
        post.id === action.meta.arg.postId
          ? {
              ...post,
              ...updated,
              // Keep fields the edit response may leave out
              quotedPost: updated.quotedPost || post.quotedPost,
              location: updated.location || post.location,
              locationLabel: updated.locationLabel || post.locationLabel,
              isOwnedByCurrentUser: true,
            }
          : post
      );
      writePulseFeedCache(state);
    });
    builder.addCase(deletePulsePost.fulfilled, (state, action) => {
      removePostFromFeed(state, action.payload);
      writePulseFeedCache(state);
    });
    builder.addCase(reportPulsePost.fulfilled, (state, action) => {
      removePostFromFeed(state, action.payload);
      writePulseFeedCache(state);
    });
    builder.addCase(updatePulseComment.fulfilled, (state, action) => {
      state.comments = state.comments.map((comment) =>
        comment.id === action.meta.arg.commentId
          ? { ...comment, ...action.payload, isOwnedByCurrentUser: comment.isOwnedByCurrentUser }
          : comment
      );
    });
    const dropComment = (
      state: PulseState,
      { postId, commentId }: { postId: string; commentId: string }
    ) => {
      const before = state.comments.length;
      state.comments = state.comments.filter((c) => c.id !== commentId);
      if (state.comments.length === before) return;
      state.posts = state.posts.map((post) =>
        post.id === postId
          ? { ...post, commentsCount: Math.max(0, post.commentsCount - 1) }
          : post
      );
      writePulseFeedCache(state);
    };
    builder.addCase(deletePulseComment.fulfilled, (state, action) =>
      dropComment(state, action.payload)
    );
    builder.addCase(reportPulseComment.fulfilled, (state, action) =>
      dropComment(state, action.payload)
    );
    builder.addCase(blockPulseAuthorOf.fulfilled, (state, action) => {
      const target = action.payload.target;
      if ("postId" in target) removePostFromFeed(state, target.postId);
      else state.comments = state.comments.filter((c) => c.id !== target.commentId);
      // The caller refetches the feed (force) so all their content disappears
      writePulseFeedCache(state);
    });
  },
});

export type GetPulsePostsArg = (FetchPulsePostsParams & { force?: boolean }) | void;

export const getPulsePosts = createAsyncThunk<
  PulsePostsPage,
  GetPulsePostsArg,
  { state: { pulse: PulseState } }
>(
  "pulse/getPulsePosts",
  async (params, { rejectWithValue }) => {
    const { force: _force, ...query } = (params ?? {}) as FetchPulsePostsParams & {
      force?: boolean;
    };
    try {
      return await fetchInThunk({
        asyncCallback: async () => ({
          data: await fetchPulsePosts(query),
        }),
        rejectWithValue,
      });
    } finally {
      pulsePostsInFlight = false;
    }
  },
  {
    condition: (params, { getState }) => {
      if (pulsePostsInFlight) return false;

      const pulse = getState().pulse;
      if (pulse.status.getPosts === "pending") return false;

      const force = Boolean(params && "force" in params && params.force);
      if (force) {
        pulsePostsInFlight = true;
        return true;
      }

      // Serve localStorage / Redux cache without hitting the API
      if (isPulseFeedFresh(pulse.postsFetchedAt)) {
        return false;
      }

      // After 429 / errors, back off even if cache is stale
      if (isWithinFetchBackoff(pulse.lastFetchErrorAt)) {
        return false;
      }

      pulsePostsInFlight = true;
      return true;
    },
  }
);

export const createPulsePost = createAsyncThunk<PulseCreateResult, CreatePulsePostPayload>(
  "pulse/createPulsePost",
  async (payload, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: async () => ({ data: await createPulsePostRequest(payload) }),
      rejectWithValue,
    });
  }
);

export const togglePulsePostLike = createAsyncThunk<
  PulseLikeUpdate,
  string,
  { state: { pulse: PulseState } }
>("pulse/togglePulsePostLike", async (postId, { rejectWithValue, getState }) => {
  const post = getState().pulse.posts.find((p) => p.id === postId);
  const current = post
    ? { liked: post.isLikedByCurrentUser, count: post.likesCount }
    : undefined;
  return await fetchInThunk({
    asyncCallback: async () => ({
      data: await togglePulsePostLikeRequest(postId, current),
    }),
    rejectWithValue,
  });
});

export const getPulseComments = createAsyncThunk<
  { comments: PulseComment[]; postId: string },
  string
>("pulse/getPulseComments", async (postId, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: async () => ({
      data: { comments: await fetchPulseComments(postId), postId },
    }),
    rejectWithValue,
  });
});

export const createPulseComment = createAsyncThunk<
  PulseComment,
  CreatePulseCommentPayload
>("pulse/createPulseComment", async (payload, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: async () => ({ data: await createPulseCommentRequest(payload) }),
    rejectWithValue,
  });
});

export const togglePulseCommentLike = createAsyncThunk<
  PulseCommentLikeUpdate,
  { postId: string; commentId: string },
  { state: { pulse: PulseState } }
>(
  "pulse/togglePulseCommentLike",
  async ({ postId, commentId }, { rejectWithValue, getState }) => {
    const comment = getState().pulse.comments.find((c) => c.id === commentId);
    const current = comment
      ? { liked: comment.isLikedByCurrentUser, count: comment.likesCount }
      : undefined;
    return await fetchInThunk({
      asyncCallback: async () => ({
        data: await togglePulseCommentLikeRequest(postId, commentId, current),
      }),
      rejectWithValue,
    });
  }
);

function apiThunk<Result, Arg>(type: string, request: (arg: Arg) => Promise<Result>) {
  return createAsyncThunk<Result, Arg>(type, async (arg, { rejectWithValue }) =>
    fetchInThunk({
      asyncCallback: async () => ({ data: await request(arg) }),
      rejectWithValue,
    })
  );
}

/** Plain repost. `postId` should be the original (not a plain repost). */
export const repostPulsePost = apiThunk("pulse/repost", (postId: string) =>
  repostPulsePostRequest(postId)
);

export const undoPulseRepost = apiThunk("pulse/undoRepost", async (postId: string) => {
  await undoPulseRepostRequest(postId);
  return postId;
});

export const updatePulsePost = apiThunk(
  "pulse/updatePost",
  ({ postId, changes }: { postId: string; changes: UpdatePulsePostPayload }) =>
    updatePulsePostRequest(postId, changes)
);

export const deletePulsePost = apiThunk("pulse/deletePost", async (postId: string) => {
  await deletePulsePostRequest(postId);
  return postId;
});

type ReportArg = { reason: PulseReportReason; details?: string };

/** Reporting hides the item for this user. */
export const reportPulsePost = apiThunk(
  "pulse/reportPost",
  async ({ postId, reason, details }: ReportArg & { postId: string }) => {
    await reportPulsePostRequest(postId, reason, details);
    return postId;
  }
);

export const updatePulseComment = apiThunk(
  "pulse/updateComment",
  ({ postId, commentId, changes }: { postId: string; commentId: string; changes: CommentChanges }) =>
    updatePulseCommentRequest(postId, commentId, changes)
);

export const deletePulseComment = apiThunk(
  "pulse/deleteComment",
  async ({ postId, commentId }: { postId: string; commentId: string }) => {
    await deletePulseCommentRequest(postId, commentId);
    return { postId, commentId };
  }
);

export const reportPulseComment = apiThunk(
  "pulse/reportComment",
  async ({
    postId,
    commentId,
    reason,
    details,
  }: ReportArg & { postId: string; commentId: string }) => {
    await reportPulseCommentRequest(postId, commentId, reason, details);
    return { postId, commentId };
  }
);

/** Blocks the author of a post or comment, then the feed is refetched. */
export const blockPulseAuthorOf = apiThunk(
  "pulse/block",
  async (target: { postId: string } | { commentId: string }) => {
    const block = await blockPulseAuthor(target);
    return { block, target };
  }
);

export const { clearPulse, setActivePostId, clearPulseComments, clearCreatePostStatus, hydratePulseFeedFromCache } =
  pulseSlice.actions;
export default pulseSlice.reducer;
