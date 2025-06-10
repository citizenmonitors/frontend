import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AdminDetailedUpload, AdminElectionUpload, FetchState } from "../types"
import fetchInThunk from "../helpers/fetchInThunk";
import axios from "axios";
import { backendRoutes } from "@/app/data/backend";
import backendAxiosConfig from "@/app/data/axiosConfig";
import handleStateError from "../helpers/handleStateError";

type InitialUploadState = {
  uploads: Array<AdminElectionUpload>;
  upload: AdminDetailedUpload | null;
  status: {
    fetchUploads: FetchState;
    fetchUpload: FetchState;
    deleteUpload: FetchState;
  },
  error: {
    message: string | null;
  }
}

const initialState: InitialUploadState = {
  uploads: [],
  upload: null,
  status: {
    fetchUploads: 'not started',
    fetchUpload: 'not started',
    deleteUpload: 'not started'
  },
  error: {
    message: null
  }
};

const adminUploadSlice = createSlice({
  name: 'admin-upload',
  initialState,
  reducers: {
    clearUpload(state) {
      state.upload = null;
      state.status.fetchUpload = 'not started';
      state.status.deleteUpload = 'not started';
      state.error.message = null;
    },
    clearUploads(state) {
      state.uploads = [];
      state.status.fetchUploads = 'not started';
      state.error.message = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Uploads
    builder.addCase(getUploads.pending, (state) => {
      state.status.fetchUploads = 'pending';
    });
    builder.addCase(getUploads.fulfilled, (state, action) => {
      state.uploads = action.payload.results;
      state.status.fetchUploads = 'fulfilled';
    });
    builder.addCase(getUploads.rejected, (state, action: any) => {
      state.status.fetchUploads = 'rejected';
      handleStateError(state, action);
    });

    // Fetch Upload
    builder.addCase(getUpload.pending, (state) => {
      state.status.fetchUpload = 'pending';
    });
    builder.addCase(getUpload.fulfilled, (state, action) => {
      state.upload = action.payload.result;
      state.status.fetchUpload = 'fulfilled';
    });
    builder.addCase(getUpload.rejected, (state, action: any) => {
      state.status.fetchUpload = 'rejected';
      handleStateError(state, action);
    });

    // Delete Upload
    builder.addCase(deleteUpload.pending, (state) => {
      state.status.deleteUpload = 'pending';
    });
    builder.addCase(deleteUpload.fulfilled, (state, action) => {
      state.uploads = state.uploads.filter((upload) => upload.id !== action.meta.arg);
      state.status.deleteUpload = 'fulfilled';
    });
    builder.addCase(deleteUpload.rejected, (state, action: any) => {
      state.status.deleteUpload = 'rejected';
      handleStateError(state, action);
    });
  }
});

export const getUploads = createAsyncThunk<{ results: Array<AdminElectionUpload> }, void>(
  'admin-upload/getUploads',
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(
        backendRoutes.admin.uploads.get,
        backendAxiosConfig()
      ),
      rejectWithValue
    });
  }
);

export const getUpload = createAsyncThunk<{ result: AdminDetailedUpload }, string>(
  'admin-upload/getUpload',
  async (uploadId, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(
        backendRoutes.admin.uploads.getById(uploadId),
        backendAxiosConfig()
      ),
      rejectWithValue
    });
  }
);

export const deleteUpload = createAsyncThunk<void, string>(
  'admin-upload/deleteUpload',
  async (uploadId, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.delete(
        backendRoutes.admin.uploads.delete(uploadId),
        backendAxiosConfig()
      ),
      rejectWithValue
    });
  }
);

export const { clearUpload, clearUploads } = adminUploadSlice.actions;
export default adminUploadSlice.reducer;