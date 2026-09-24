import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createPulseComment as createPulseCommentRequest,
  createPulsePost as createPulsePostRequest,
  fetchPulseComments,
  fetchPulsePosts,
  PulseCommentLikeUpdate,
  PulseLikeUpdate,
  togglePulseCommentLike as togglePulseCommentLikeRequest,
  togglePulsePostLike as togglePulsePostLikeRequest,
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
};

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

      const incoming = action.payload.posts;
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
    });
    builder.addCase(createPulsePost.fulfilled, (state, action) => {
      state.status.createPost = "fulfilled";
      const quoted = action.meta.arg.quotedPost || action.payload.quotedPost;
      const nextPost = {
        ...action.payload,
        quotedPost: quoted || action.payload.quotedPost || null,
        location: action.payload.location || action.meta.arg.location || null,
        visibilityScope:
          action.payload.visibilityScope ||
          action.meta.arg.visibilityScope ||
          "public",
        locationLabel:
          action.payload.locationLabel ||
          action.meta.arg.locationLabel ||
          null,
      };
      state.posts = [nextPost, ...state.posts];
      state.total += 1;
      state.postsFetchedAt = Date.now();

      if (quoted?.id) {
        state.posts = state.posts.map((post) =>
          post.id === quoted.id
            ? { ...post, repostsCount: (post.repostsCount || 0) + 1 }
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

export const createPulsePost = createAsyncThunk<PulsePost, CreatePulsePostPayload>(
  "pulse/createPulsePost",
  async (payload, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: async () => ({ data: await createPulsePostRequest(payload) }),
      rejectWithValue,
    });
  }
);

export const togglePulsePostLike = createAsyncThunk<PulseLikeUpdate, string>(
  "pulse/togglePulsePostLike",
  async (postId, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: async () => ({ data: await togglePulsePostLikeRequest(postId) }),
      rejectWithValue,
    });
  }
);

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
  { postId: string; commentId: string }
>("pulse/togglePulseCommentLike", async ({ postId, commentId }, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: async () => ({
      data: await togglePulseCommentLikeRequest(postId, commentId),
    }),
    rejectWithValue,
  });
});

export const { clearPulse, setActivePostId, clearPulseComments, clearCreatePostStatus, hydratePulseFeedFromCache } =
  pulseSlice.actions;
export default pulseSlice.reducer;
