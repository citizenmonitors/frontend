import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchState, User } from "../types";
import fetchInThunk from "../helpers/fetchInThunk";
import axios from "axios";
import { backendRoutes } from "@/app/data/backend";
import backendAxiosConfig from "@/app/data/axiosConfig";
import handleStateError from "../helpers/handleStateError";

export type AdminTableVerificationUser = Pick<
  User,
  | "_id"
  | "role"
  | "email"
  | "firstName"
  | "lastName"
  | "createdAt"
  | "gender"
  | "state"
  | "pendingObserverVerification"
  // Verification Details
  | keyof User["observerVerificationDetails"]
>;

type InitialVerificationState = {
  verifiedUsers: Array<AdminTableVerificationUser>;
  pendingVerificationUsers: Array<AdminTableVerificationUser>;
  user: User | null;
  status: {
    fetchUsers: FetchState;
    approveUser: FetchState;
    downgradeUser: FetchState;
  };
  error: {
    message: string | null;
  };
}

const initialState: InitialVerificationState = {
  verifiedUsers: [],
  pendingVerificationUsers: [],
  user: null,
  status: {
    fetchUsers: "not started",
    approveUser: "not started",
    downgradeUser: "not started",
  },
  error: {
    message: null,
  },
};

const adminVerificationSlice = createSlice({
  name: "admin-verification",
  initialState,
  reducers: {
    clearVerificationUser(state) {
      state.user = null;
      state.status.approveUser = "not started";
      state.status.downgradeUser = "not started";
      state.error.message = null;
    },
    clearVerificationUsers(state) {
      state.verifiedUsers = [];
      state.pendingVerificationUsers = [];
      state.status.fetchUsers = "not started";
      state.error.message = null;
    }
  },
  extraReducers: (builder) => {
    // Get verified users
    builder.addCase(getVerifiedUsers.pending, (state) => {
      state.status.fetchUsers = "pending";
    });
    builder.addCase(getVerifiedUsers.fulfilled, (state, action) => {
      state.status.fetchUsers = "fulfilled";
      state.verifiedUsers = action.payload.observers.filter((u) => !u.pendingObserverVerification);
      state.pendingVerificationUsers = action.payload.observers.filter((u) => u.pendingObserverVerification);
    });
    builder.addCase(getVerifiedUsers.rejected, (state, action: any) => {
      state.status.fetchUsers = "rejected";
      handleStateError(state, action);
    });

    // Approve user
    builder.addCase(approveUser.pending, (state) => {
      state.status.approveUser = "pending";
    });
    builder.addCase(approveUser.fulfilled, (state, action) => {
      state.status.approveUser = "fulfilled";
      state.verifiedUsers = action.payload.observers.filter((u) => !u.pendingObserverVerification);
      state.pendingVerificationUsers = action.payload.observers.filter((u) => u.pendingObserverVerification);
    });
    builder.addCase(approveUser.rejected, (state, action: any) => {
      state.status.approveUser = "rejected";
      handleStateError(state, action);
    });

    // Downgrade user
    builder.addCase(downgradeUser.pending, (state) => {
      state.status.downgradeUser = "pending";
    });
    builder.addCase(downgradeUser.fulfilled, (state, action) => {
      state.status.downgradeUser = "fulfilled";
      state.verifiedUsers = action.payload.observers.filter((u) => !u.pendingObserverVerification);
      state.pendingVerificationUsers = action.payload.observers.filter((u) => u.pendingObserverVerification);
    });
    builder.addCase(downgradeUser.rejected, (state, action: any) => {
      state.status.downgradeUser = "rejected";
      handleStateError(state, action);
    });

  },
});

export const getVerifiedUsers = createAsyncThunk<{ observers: Array<AdminTableVerificationUser> }, void>(
  "admin-verification/getVerifiedUsers",
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(backendRoutes.admin.verification.get, backendAxiosConfig()),
      rejectWithValue,
    });
  }
);

export const approveUser = createAsyncThunk<{ observers: Array<AdminTableVerificationUser> }, string>(
  "admin-verification/approveUser",
  async (userId, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.patch(backendRoutes.admin.verification.approve(userId), { userId }, backendAxiosConfig()),
      rejectWithValue,
    });
  }
);

export const downgradeUser = createAsyncThunk<{ observers: Array<AdminTableVerificationUser> }, { userId: string, adminReason: string }>(
  "admin-verification/downgradeUser",
  async ({ userId, adminReason }, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.patch(backendRoutes.admin.verification.downgrade(userId), { adminReason }, backendAxiosConfig()),
      rejectWithValue,
    });
  }
);

export const { clearVerificationUser, clearVerificationUsers } = adminVerificationSlice.actions;
export default adminVerificationSlice.reducer;