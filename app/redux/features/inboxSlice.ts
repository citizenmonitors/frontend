import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminPodcast, FetchState, Podcast } from "../types";
import axios from "axios";
import backendAxiosConfig from "@/app/data/axiosConfig";
import { backendRoutes } from "@/app/data/backend";
import handleStateError from "../helpers/handleStateError";
import fetchInThunk from "../helpers/fetchInThunk";

type InitialOutboxState = {
  podcasts: Podcast[];
  status: {
    getPodcasts: FetchState;
    markRead: FetchState;
  };
  error: {
    message: string | null;
  };
};

const initialState: InitialOutboxState = {
  podcasts: [],
  status: {
    getPodcasts: "not started",
    markRead: "not started",
  },
  error: {
    message: null,
  },
};

const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    clearInbox() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Get All Podcasts
    builder.addCase(getPodcasts.pending, (state) => {
      state.status.getPodcasts = "pending";
    });
    builder.addCase(getPodcasts.fulfilled, (state, action) => {
      state.status.getPodcasts = "fulfilled";
      state.podcasts = action.payload.inbox;
    });
    builder.addCase(getPodcasts.rejected, (state, action: any) => {
      state.status.getPodcasts = "rejected";
      handleStateError(state, action);
    });

    // Mark Podcast as Read
    builder.addCase(markPodcastAsRead.pending, (state) => {
      state.status.markRead = "pending";
    });
    builder.addCase(markPodcastAsRead.fulfilled, (state, action) => {
      state.status.markRead = "fulfilled";
      // state.podcasts = state.podcasts.map((podcast) => {
      //   if (podcast._id === action.meta.arg) {
      //     return { ...podcast, read: true };
      //   }
      //   return podcast;
      // });
    });
    builder.addCase(markPodcastAsRead.rejected, (state, action: any) => {
      state.status.markRead = "rejected";
      handleStateError(state, action);
    });
  },
});

// Get All Podcasts
export const getPodcasts = createAsyncThunk<{ inbox: Podcast[] }>(
  "inbox/getPodcasts",
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(backendRoutes.dashboard.inbox.get, backendAxiosConfig()),
      rejectWithValue,
    });
  }
);

// Mark Podcast as Read
export const markPodcastAsRead = createAsyncThunk<{ message: string }, string>(
  "inbox/markPodcastAsRead",
  async (id: string, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () =>
        axios.patch(backendRoutes.dashboard.inbox.markRead(id), {}, backendAxiosConfig()),
      rejectWithValue,
    });
  }
);



export const { clearInbox } = inboxSlice.actions;
export default inboxSlice.reducer;