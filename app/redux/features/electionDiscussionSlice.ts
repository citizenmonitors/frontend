import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createElectionDiscussionComment as createElectionDiscussionCommentRequest,
  createElectionDiscussionPost as createElectionDiscussionPostRequest,
  ElectionDiscussionCommentLikeUpdate,
  ElectionDiscussionLikeUpdate,
  fetchElectionDiscussionComments,
  fetchElectionDiscussionPosts,
  toggleElectionDiscussionCommentLike as toggleElectionDiscussionCommentLikeRequest,
  toggleElectionDiscussionPostLike as toggleElectionDiscussionPostLikeRequest,
} from "@/app/data/electionDiscussionApi";
import handleStateError from "../helpers/handleStateError";
import fetchInThunk from "../helpers/fetchInThunk";
import {
  CreateElectionDiscussionCommentPayload,
  CreateElectionDiscussionPostPayload,
  ElectionDiscussionComment,
  ElectionDiscussionPost,
  ElectionDiscussionPostsPage,
  FetchElectionDiscussionPostsParams,
  FetchState,
} from "../types";

type ElectionDiscussionState = {
  activeElectionId: string | null;
  posts: ElectionDiscussionPost[];
  comments: ElectionDiscussionComment[];
  activePostId: string | null;
  total: number;
  page: number;
  limit: number;
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

const initialState: ElectionDiscussionState = {
  activeElectionId: null,
  posts: [],
  comments: [],
  activePostId: null,
  total: 0,
  page: 1,
  limit: 20,
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

const electionDiscussionSlice = createSlice({
  name: "electionDiscussion",
  initialState,
  reducers: {
    clearElectionDiscussion() {
      return initialState;
    },
    clearElectionDiscussionComments(state) {
      state.comments = [];
      state.activePostId = null;
    },
    resetElectionDiscussionMutations(state) {
      state.status.createPost = "not started";
      state.status.createComment = "not started";
      state.status.likePost = "not started";
      state.status.likeComment = "not started";
      state.error.message = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getElectionDiscussionPosts.pending, (state) => {
      state.status.getPosts = "pending";
    });
    builder.addCase(getElectionDiscussionPosts.fulfilled, (state, action) => {
      state.status.getPosts = "fulfilled";
      state.activeElectionId = action.meta.arg.activeElectionId;
      state.posts = action.payload.posts;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
    });
    builder.addCase(getElectionDiscussionPosts.rejected, (state, action: any) => {
      state.status.getPosts = "rejected";
      handleStateError(state, action);
    });

    builder.addCase(createElectionDiscussionPost.pending, (state) => {
      state.status.createPost = "pending";
    });
    builder.addCase(createElectionDiscussionPost.fulfilled, (state) => {
      state.status.createPost = "fulfilled";
    });
    builder.addCase(createElectionDiscussionPost.rejected, (state, action: any) => {
      state.status.createPost = "rejected";
      handleStateError(state, action);
    });

    builder.addCase(toggleElectionDiscussionPostLike.pending, (state) => {
      state.status.likePost = "pending";
    });
    builder.addCase(toggleElectionDiscussionPostLike.fulfilled, (state, action) => {
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
    builder.addCase(toggleElectionDiscussionPostLike.rejected, (state, action: any) => {
      state.status.likePost = "rejected";
      handleStateError(state, action);
    });

    builder.addCase(getElectionDiscussionComments.pending, (state) => {
      state.status.getComments = "pending";
    });
    builder.addCase(getElectionDiscussionComments.fulfilled, (state, action) => {
      state.status.getComments = "fulfilled";
      state.comments = action.payload.comments;
      state.activePostId = action.payload.postId;
    });
    builder.addCase(getElectionDiscussionComments.rejected, (state, action: any) => {
      state.status.getComments = "rejected";
      handleStateError(state, action);
    });

    builder.addCase(createElectionDiscussionComment.pending, (state) => {
      state.status.createComment = "pending";
    });
    builder.addCase(createElectionDiscussionComment.fulfilled, (state, action) => {
      state.status.createComment = "fulfilled";
      state.comments = [...state.comments, action.payload];
      state.posts = state.posts.map((post) =>
        post.id === action.payload.postId
          ? { ...post, commentsCount: post.commentsCount + 1 }
          : post
      );
    });
    builder.addCase(createElectionDiscussionComment.rejected, (state, action: any) => {
      state.status.createComment = "rejected";
      handleStateError(state, action);
    });

    builder.addCase(toggleElectionDiscussionCommentLike.pending, (state) => {
      state.status.likeComment = "pending";
    });
    builder.addCase(toggleElectionDiscussionCommentLike.fulfilled, (state, action) => {
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
    builder.addCase(toggleElectionDiscussionCommentLike.rejected, (state, action: any) => {
      state.status.likeComment = "rejected";
      handleStateError(state, action);
    });
  },
});

export const getElectionDiscussionPosts = createAsyncThunk<
  ElectionDiscussionPostsPage,
  FetchElectionDiscussionPostsParams
>("electionDiscussion/getPosts", async (params, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: async () => ({
      data: await fetchElectionDiscussionPosts(params),
    }),
    rejectWithValue,
  });
});

export const createElectionDiscussionPost = createAsyncThunk<
  ElectionDiscussionPost,
  CreateElectionDiscussionPostPayload
>("electionDiscussion/createPost", async (payload, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: async () => ({
      data: await createElectionDiscussionPostRequest(payload),
    }),
    rejectWithValue,
  });
});

export const toggleElectionDiscussionPostLike = createAsyncThunk<
  ElectionDiscussionLikeUpdate,
  { activeElectionId: string; postId: string }
>("electionDiscussion/togglePostLike", async ({ activeElectionId, postId }, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: async () => ({
      data: await toggleElectionDiscussionPostLikeRequest(activeElectionId, postId),
    }),
    rejectWithValue,
  });
});

export const getElectionDiscussionComments = createAsyncThunk<
  { comments: ElectionDiscussionComment[]; postId: string },
  { activeElectionId: string; postId: string }
>("electionDiscussion/getComments", async ({ activeElectionId, postId }, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: async () => ({
      data: {
        comments: await fetchElectionDiscussionComments(activeElectionId, postId),
        postId,
      },
    }),
    rejectWithValue,
  });
});

export const createElectionDiscussionComment = createAsyncThunk<
  ElectionDiscussionComment,
  CreateElectionDiscussionCommentPayload
>("electionDiscussion/createComment", async (payload, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: async () => ({
      data: await createElectionDiscussionCommentRequest(payload),
    }),
    rejectWithValue,
  });
});

export const toggleElectionDiscussionCommentLike = createAsyncThunk<
  ElectionDiscussionCommentLikeUpdate,
  { activeElectionId: string; postId: string; commentId: string }
>(
  "electionDiscussion/toggleCommentLike",
  async ({ activeElectionId, postId, commentId }, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: async () => ({
        data: await toggleElectionDiscussionCommentLikeRequest(
          activeElectionId,
          postId,
          commentId
        ),
      }),
      rejectWithValue,
    });
  }
);

export const { clearElectionDiscussion, clearElectionDiscussionComments, resetElectionDiscussionMutations } =
  electionDiscussionSlice.actions;
export default electionDiscussionSlice.reducer;
