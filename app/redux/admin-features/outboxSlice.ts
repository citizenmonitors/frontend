import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminPodcast, FetchState } from "../types";
import axios from "axios";
import backendAxiosConfig from "@/app/data/axiosConfig";
import { backendRoutes } from "@/app/data/backend";
import handleStateError from "../helpers/handleStateError";
import fetchInThunk from "../helpers/fetchInThunk";

type InitialOutboxState = {
  podcasts: AdminPodcast[];
  currentPodcast: AdminPodcast | null;
  status: {
    getPodcasts: FetchState;
    getPodcast: FetchState;
    createPodcast: FetchState;
    updatePodcast: FetchState;
    deletePodcast: FetchState;
  };
  error: {
    message: string | null;
  };
};

const initialState: InitialOutboxState = {
  podcasts: [],
  currentPodcast: null,
  status: {
    getPodcasts: "not started",
    getPodcast: "not started",
    createPodcast: "not started",
    updatePodcast: "not started",
    deletePodcast: "not started",
  },
  error: {
    message: null,
  },
};

const outboxSlice = createSlice({
  name: "outbox",
  initialState,
  reducers: {
    clearOutbox() {
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
      state.podcasts = action.payload;
    });
    builder.addCase(getPodcasts.rejected, (state, action: any) => {
      state.status.getPodcasts = "rejected";
      handleStateError(state, action);
    });

    // Get Single Podcast
    builder.addCase(getPodcast.pending, (state) => {
      state.status.getPodcast = "pending";
    });
    builder.addCase(getPodcast.fulfilled, (state, action) => {
      state.status.getPodcast = "fulfilled";
      state.currentPodcast = action.payload;
    });
    builder.addCase(getPodcast.rejected, (state, action: any) => {
      state.status.getPodcast = "rejected";
      handleStateError(state, action);
    });

    // Create Podcast
    builder.addCase(createPodcast.pending, (state) => {
      state.status.createPodcast = "pending";
    });
    builder.addCase(createPodcast.fulfilled, (state) => {
      state.status.createPodcast = "fulfilled";
    });
    builder.addCase(createPodcast.rejected, (state, action: any) => {
      state.status.createPodcast = "rejected";
      handleStateError(state, action);
    });

    // Update Podcast
    builder.addCase(updatePodcast.pending, (state) => {
      state.status.updatePodcast = "pending";
    });
    builder.addCase(updatePodcast.fulfilled, (state) => {
      state.status.updatePodcast = "fulfilled";
    });
    builder.addCase(updatePodcast.rejected, (state, action: any) => {
      state.status.updatePodcast = "rejected";
      handleStateError(state, action);
    });

    // Delete Podcast
    builder.addCase(deletePodcast.pending, (state) => {
      state.status.deletePodcast = "pending";
    });
    builder.addCase(deletePodcast.fulfilled, (state) => {
      state.status.deletePodcast = "fulfilled";
    });
    builder.addCase(deletePodcast.rejected, (state, action: any) => {
      state.status.deletePodcast = "rejected";
      handleStateError(state, action);
    });
  },
});

// Get All Podcasts
export const getPodcasts = createAsyncThunk<AdminPodcast[]>(
  "outbox/getPodcasts",
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(backendRoutes.admin.outbox.get, backendAxiosConfig()),
      rejectWithValue,
    });
  }
);

// Get Single Podcast
export const getPodcast = createAsyncThunk<AdminPodcast, string>(
  "outbox/getPodcast",
  async (id, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(backendRoutes.admin.outbox.getById(id), backendAxiosConfig()),
      rejectWithValue,
    });
  }
);

// Create Podcast
type CreatePodcastProps = Pick<AdminPodcast, "title" | "content" | "recipients">;
export const createPodcast = createAsyncThunk<void, CreatePodcastProps>(
  "outbox/createPodcast",
  async (formData, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(
        backendRoutes.admin.outbox.create,
        formData,
        backendAxiosConfig()
      ),
      rejectWithValue,
    });
  }
);

// Update Podcast
export const updatePodcast = createAsyncThunk<void, { id: string; formData: FormData }>(
  "outbox/updatePodcast",
  async ({ id, formData }, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.put(
        backendRoutes.admin.outbox.update(id),
        formData,
        backendAxiosConfig()
      ),
      rejectWithValue,
    });
  }
);

// Delete Podcast
export const deletePodcast = createAsyncThunk<void, string>(
  "outbox/deletePodcast",
  async (id, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.delete(backendRoutes.admin.outbox.delete(id), backendAxiosConfig()),
      rejectWithValue,
    });
  }
);

export const { clearOutbox } = outboxSlice.actions;
export default outboxSlice.reducer;
