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

/** Skip refetch while feed is fresher than this (client-side cache). */
export const PULSE_FEED_STALE_MS = 2 * 60 * 1000;

type PulseState = {
  posts: PulsePost[];
  comments: PulseComment[];
  activePostId: string | null;
  total: number;
  page: number;
  limit: number;
  /** Epoch ms when posts were last fetched successfully */
  postsFetchedAt: number | null;
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

const initialState: PulseState = {
  posts: [],
  comments: [],
  activePostId: null,
  total: 0,
  page: 1,
  limit: 20,
  postsFetchedAt: null,
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
      return initialState;
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
      state.status.getPosts = "fulfilled";
      state.posts = action.payload.posts;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.postsFetchedAt = Date.now();
    });
    builder.addCase(getPulsePosts.rejected, (state, action: any) => {
      state.status.getPosts = "rejected";
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
    return await fetchInThunk({
      asyncCallback: async () => ({
        data: await fetchPulsePosts(query),
      }),
      rejectWithValue,
    });
  },
  {
    condition: (params, { getState }) => {
      const pulse = getState().pulse;
      if (pulse.status.getPosts === "pending") return false;

      const force = Boolean(params && "force" in params && params.force);
      if (force) return true;

      if (
        pulse.postsFetchedAt != null &&
        Date.now() - pulse.postsFetchedAt < PULSE_FEED_STALE_MS
      ) {
        return false;
      }

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

export const { clearPulse, setActivePostId, clearPulseComments, clearCreatePostStatus } =
  pulseSlice.actions;
export default pulseSlice.reducer;
