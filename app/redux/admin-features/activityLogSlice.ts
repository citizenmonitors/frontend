import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchState, User, UserRole } from "../types";
import fetchInThunk from "../helpers/fetchInThunk";
import axios from "axios";
import { backendRoutes } from "@/app/data/backend";
import backendAxiosConfig from "@/app/data/axiosConfig";
import handleStateError from "../helpers/handleStateError";

export type AdminTableActivity = {
  "admin": {
    "_id": string,
    "role": UserRole,
    "email": string,
    "firstName": string,
    "lastName": string,
    "createdAt": string,
    "action": string,
    "timeCreated": string,
  }
};

type InitialActivityLogState = {
  activities: Array<AdminTableActivity>;
  status: {
    fetchActivities: FetchState;
  };
  error: {
    message: string | null;
  };
}

const initialState: InitialActivityLogState = {
  activities: [],
  status: {
    fetchActivities: "not started",
  },
  error: {
    message: null,
  },
};

const adminActivityLogSlice = createSlice({
  name: "admin-verification",
  initialState,
  reducers: {
    clearActivities(state) {
      state.activities = [];
      state.status.fetchActivities = "not started";
      state.error.message = null;
    },
  },
  extraReducers: (builder) => {
    // Get activities
    builder.addCase(getActivities.pending, (state) => {
      state.status.fetchActivities = "pending";
    });
    builder.addCase(getActivities.fulfilled, (state, action) => {
      state.status.fetchActivities = "fulfilled";
      state.activities = [...action.payload].sort((a, b) => {
        return (
          new Date(a.admin.timeCreated).getTime() -
          new Date(b.admin.timeCreated).getTime()
        );
      });
    });
    builder.addCase(getActivities.rejected, (state, action: any) => {
      state.status.fetchActivities = "rejected";
      handleStateError(state, action);
    });
  },
});

export const getActivities = createAsyncThunk<Array<AdminTableActivity>, void>(
  "admin-verification/getActivities",
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(backendRoutes.admin.activityLog.get, backendAxiosConfig()),
      rejectWithValue,
    });
  }
);

export const { clearActivities } = adminActivityLogSlice.actions;
export default adminActivityLogSlice.reducer;