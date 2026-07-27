import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AdminDetailedFlaggedUpload, AdminFlaggedUpload, FetchState } from "../types";
import axios from "axios";
import { backendRoutes } from "@/app/data/backend";
import backendAxiosConfig from "@/app/data/axiosConfig";
import fetchInThunk from "../helpers/fetchInThunk";
import handleStateError from "../helpers/handleStateError";

type InitialFlaggedUploadState = {
  uploads: Array<AdminFlaggedUpload>;
  upload: AdminDetailedFlaggedUpload | null;
  status: {
    fetchFlaggedUploads: FetchState;
    fetchFlaggedUpload: FetchState;
    restoreFlaggedUpload: FetchState;
    deleteFlaggedUpload: FetchState;
  },
  error: {
    message: string | null;
  }
}

const initialState: InitialFlaggedUploadState = {
  uploads: [],
  upload: null,
  status: {
    fetchFlaggedUploads: 'not started',
    fetchFlaggedUpload: 'not started',
    restoreFlaggedUpload: 'not started',
    deleteFlaggedUpload: 'not started'
  },
  error: {
    message: null
  }
};

const adminFlaggedUploadSlice = createSlice({
  name: 'admin-flagged-upload',
  initialState,
  reducers: {
    clearFlaggedUpload(state) {
      state.upload = null;
      state.status.fetchFlaggedUpload = 'not started';
      state.status.restoreFlaggedUpload = 'not started';
      state.status.deleteFlaggedUpload = 'not started';
      state.error.message = null;
    },
    clearFlaggedUploads(state) {
      state.uploads = [];
      state.status.fetchFlaggedUploads = 'not started';
      state.error.message = null;
    }
  },
  extraReducers: (builder) => {
    // Get Flagged Uploads
    builder.addCase(getFlaggedUploads.pending, (state) => {
      state.status.fetchFlaggedUploads = 'pending';
    });

    builder.addCase(getFlaggedUploads.fulfilled, (state, action) => {
      state.uploads = sortFlaggedUploads(action.payload.results);
      state.status.fetchFlaggedUploads = 'fulfilled';
    });

    builder.addCase(getFlaggedUploads.rejected, (state, action: any) => {
      state.status.fetchFlaggedUploads = 'rejected';
      handleStateError(state, action);
    });

    // Get Flagged Upload
    builder.addCase(getFlaggedUpload.pending, (state) => {
      state.status.fetchFlaggedUpload = 'pending';
    });

    builder.addCase(getFlaggedUpload.fulfilled, (state, action) => {
      state.upload = action.payload.result;
      state.status.fetchFlaggedUpload = 'fulfilled';
    });

    // Restore Flagged Upload
    builder.addCase(restoreFlaggedUpload.pending, (state) => {
      state.status.restoreFlaggedUpload = 'pending';
    });

    builder.addCase(restoreFlaggedUpload.fulfilled, (state, action) => {
      state.uploads = sortFlaggedUploads(action.payload.results);
      state.status.restoreFlaggedUpload = 'fulfilled';
    });

    builder.addCase(restoreFlaggedUpload.rejected, (state, action: any) => {
      state.status.restoreFlaggedUpload = 'rejected';
      handleStateError(state, action);
    });

    // Delete Flagged Upload
    builder.addCase(deleteFlaggedUpload.pending, (state) => {
      state.status.deleteFlaggedUpload = 'pending';
    });

    builder.addCase(deleteFlaggedUpload.fulfilled, (state, action) => {
      state.uploads = sortFlaggedUploads(action.payload.results);
      state.status.deleteFlaggedUpload = 'fulfilled';
    });

    builder.addCase(deleteFlaggedUpload.rejected, (state, action: any) => {
      state.status.deleteFlaggedUpload = 'rejected';
      handleStateError(state, action);
    });
  }
});

type FlaggedResultsResponse = {
  results: Array<AdminFlaggedUpload>;
}

function sortFlaggedUploads(uploads: Array<AdminFlaggedUpload>) {
  return [...uploads].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

export const getFlaggedUploads = createAsyncThunk<FlaggedResultsResponse, void>(
  'admin-flagged-upload/getUploads',
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(
        backendRoutes.admin.flaggedUploads.get,
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const getFlaggedUpload = createAsyncThunk<{ result: AdminDetailedFlaggedUpload }, string>(
  'admin-flagged-upload/getUpload',
  async (uploadId: string, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(
        backendRoutes.admin.flaggedUploads.getById(uploadId),
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const restoreFlaggedUpload = createAsyncThunk<FlaggedResultsResponse, string>(
  'admin-flagged-upload/restoreUpload',
  async (uploadId: string, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.put(
        backendRoutes.admin.flaggedUploads.restoreFlag(uploadId),
        {},
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const deleteFlaggedUpload = createAsyncThunk<FlaggedResultsResponse, string>(
  'admin-flagged-upload/deleteUpload',
  async (uploadId: string, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.delete(
        backendRoutes.admin.flaggedUploads.deleteFlag(uploadId),
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const { clearFlaggedUpload, clearFlaggedUploads } = adminFlaggedUploadSlice.actions;
export default adminFlaggedUploadSlice.reducer;