import { email } from '@/app/data/links';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchState, SupportTicket, User } from "../types";
import axios from "axios";
import Cookies from "js-cookie";
import backendAxiosConfig from "@/app/data/axiosConfig";
import { backendRoutes } from "@/app/data/backend";
import handleStateError from "../helpers/handleStateError";
import fetchInThunk from "../helpers/fetchInThunk";
import { cookieData } from '@/app/data/cookieData';

type InitialUserState = {
  details: User | null,
  isAdmin: boolean | null,
  status: {
    validateSession: FetchState,
    loginUser: FetchState,
    forgotPassword: FetchState,
    resetPassword: FetchState,
    upgradeAccount: FetchState,
    updateAccount: FetchState,
    deleteAccount: FetchState,
    updateEmail: FetchState,
    resendEmailUpdateToken: FetchState,
    verifyEmailUpdate: FetchState,
    submitSupportTicket: FetchState,
  }
  error: {
    message: string | null,
  }
}

const initialState: InitialUserState = {
  details: null,
  isAdmin: null,
  status: {
    validateSession: 'not started',
    loginUser: 'not started',
    forgotPassword: 'not started',
    resetPassword: 'not started',
    upgradeAccount: 'not started',
    updateAccount: 'not started',
    deleteAccount: 'not started',
    updateEmail: 'not started',
    resendEmailUpdateToken: 'not started',
    verifyEmailUpdate: 'not started',
    submitSupportTicket: 'not started',
  },
  error: {
    message: null,
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser(state) {
      state.details = initialState.details;
      state.status = initialState.status;
      state.error = initialState.error;
      state.isAdmin = null;

      // Clear user token
      Cookies.remove(cookieData.login.name);
    },
    refreshUser(state) {
      state.details = initialState.details;
      state.status = initialState.status;
      state.error = initialState.error;
    },
    modifyUserDetails(state, action: PayloadAction<{ email?: string }>) {
      state.details = { ...state.details!, ...action.payload };
    },
    clearUserStateStatus(state, action: PayloadAction<{ statuses: Array<keyof typeof initialState['status']> }>) {
      action.payload.statuses.forEach((status) => {
        state.status[status] = 'not started'
      })
    },
    clearUserStatus(state, action: PayloadAction<Array<keyof InitialUserState['status']>>) {
      const statuses = action.payload;
      statuses.forEach((status) => {
        state.status[status] = 'not started'
      });
    },
    clearSupportTicket(state) {
      state.status.submitSupportTicket = 'not started';
      state.error.message = null;
    },
  },
  extraReducers: (builder) => {
    // Validate Token
    builder.addCase(validateSession.pending, (state) => {
      state.status.validateSession = 'pending';
    });
    builder.addCase(validateSession.fulfilled, (state, action) => {
      state.status.validateSession = 'fulfilled';
      state.details = action.payload.user.user || {};
    });
    builder.addCase(validateSession.rejected, (state) => {
      state.status.validateSession = 'rejected';
      state.error.message = 'Login expired. Please login again.';
    });

    // Login User
    builder.addCase(loginUser.pending, (state) => {
      state.status.loginUser = 'pending';
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status.loginUser = 'fulfilled';
      state.isAdmin = ["admin", "super-admin"].includes(action.payload.user.role);

      if (action.meta.arg.rememberMe) {
        Cookies.set(
          cookieData.login.name,
          action.payload.token,
          { expires: cookieData.login.expiration }
        );
      }
    });
    builder.addCase(loginUser.rejected, (state, action: any) => {
      state.status.loginUser = 'rejected';
      handleStateError(state, action);
    });

    // Send Password Reset Email
    builder.addCase(sendPasswordResetEmail.pending, (state) => {
      state.status.forgotPassword = 'pending';
    });
    builder.addCase(sendPasswordResetEmail.fulfilled, (state) => {
      state.status.forgotPassword = 'fulfilled';
    });
    builder.addCase(sendPasswordResetEmail.rejected, (state, action: any) => {
      state.status.forgotPassword = 'rejected';
      handleStateError(state, action);
    });

    // Reset Password
    builder.addCase(resetPassword.pending, (state) => {
      state.status.resetPassword = 'pending';
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.status.resetPassword = 'fulfilled';
    });
    builder.addCase(resetPassword.rejected, (state, action: any) => {
      state.status.resetPassword = 'rejected';
      handleStateError(state, action);
    });

    // Upgrade Account
    builder.addCase(upgradeAccount.pending, (state) => {
      state.status.upgradeAccount = 'pending';
    });
    builder.addCase(upgradeAccount.fulfilled, (state, action) => {
      state.details = action.payload.user;
      state.status.upgradeAccount = 'fulfilled';
    });
    builder.addCase(upgradeAccount.rejected, (state, action: any) => {
      state.status.upgradeAccount = 'rejected';
      handleStateError(state, action);
    });

    // Update Account
    builder.addCase(updateAccount.pending, (state) => {
      state.status.updateAccount = 'pending';
    });
    builder.addCase(updateAccount.fulfilled, (state, action) => {
      state.details = action.payload;
      state.status.updateAccount = 'fulfilled';
    });
    builder.addCase(updateAccount.rejected, (state, action: any) => {
      state.status.updateAccount = 'rejected';
      handleStateError(state, action);
    });

    // Update Email
    builder.addCase(updateEmail.pending, (state) => {
      state.status.updateEmail = 'pending';
    });
    builder.addCase(updateEmail.fulfilled, (state) => {
      state.status.updateEmail = 'fulfilled';
    });
    builder.addCase(updateEmail.rejected, (state, action: any) => {
      state.status.updateEmail = 'rejected';
      handleStateError(state, action);
    });

    // Resend Email Update Token
    builder.addCase(resendEmailUpdateToken.pending, (state) => {
      state.status.resendEmailUpdateToken = 'pending';
    });
    builder.addCase(resendEmailUpdateToken.fulfilled, (state) => {
      state.status.resendEmailUpdateToken = 'fulfilled';
    });
    builder.addCase(resendEmailUpdateToken.rejected, (state, action: any) => {
      state.status.resendEmailUpdateToken = 'rejected';
      handleStateError(state, action);
    });

    // Verify Email Update
    builder.addCase(verifyEmailUpdate.pending, (state) => {
      state.status.verifyEmailUpdate = 'pending';
    });
    builder.addCase(verifyEmailUpdate.fulfilled, (state) => {
      state.status.verifyEmailUpdate = 'fulfilled';
    });
    builder.addCase(verifyEmailUpdate.rejected, (state, action: any) => {
      state.status.verifyEmailUpdate = 'rejected';
      handleStateError(state, action);
    });

    // Delete Account
    builder.addCase(deleteAccount.pending, (state) => {
      state.status.deleteAccount = 'pending';
    });
    builder.addCase(deleteAccount.fulfilled, (state) => {
      state.status.deleteAccount = 'fulfilled';
    });
    builder.addCase(deleteAccount.rejected, (state, action: any) => {
      state.status.deleteAccount = 'rejected';
      handleStateError(state, action);
    });

    // Submit Support Ticket
    builder.addCase(submitSupportTicket.pending, (state) => {
      state.status.submitSupportTicket = 'pending';
    });
    builder.addCase(submitSupportTicket.fulfilled, (state) => {
      state.status.submitSupportTicket = 'fulfilled';
    });
    builder.addCase(submitSupportTicket.rejected, (state, action: any) => {
      state.status.submitSupportTicket = 'rejected';
      handleStateError(state, action);
    });
  }
});

type LoginResponse = {
  token: string,
  user: User,
}

export const validateSession = createAsyncThunk<{ user: { user: User } }, void>(
  'user/validateSession',
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(backendRoutes.auth.validateToken, {}, backendAxiosConfig()),
      rejectWithValue
    });
  }
);

export const loginUser = createAsyncThunk<LoginResponse, { email: string, password: string, rememberMe: boolean }>(
  'user/loginUser',
  async (loginProps, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(backendRoutes.auth.login, loginProps, backendAxiosConfig()),
      rejectWithValue
    });
  }
);

export const sendPasswordResetEmail = createAsyncThunk<void, { email: string }>(
  'user/sendPasswordResetEmail',
  async (resetProps, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(
        backendRoutes.auth.forgetPassword, resetProps, backendAxiosConfig()),
      rejectWithValue
    });
  }
);

export const resetPassword = createAsyncThunk<void, { password: string, token: string }>(
  'user/resetPassword',
  async (resetProps, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(
        backendRoutes.auth.resetPassword, resetProps, backendAxiosConfig()),
      rejectWithValue
    })
  }
);

type UpgradeAccountProps = User['observerVerificationDetails'];
export const upgradeAccount = createAsyncThunk<
  { user: User },
  UpgradeAccountProps
>(
  "user/upgradeAccount",
  async (props, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.put(
        backendRoutes.dashboard.user.upgradeAccount,
        props,
        backendAxiosConfig({ type: 'multipart/form-data' })
      ),
      rejectWithValue
    })
  }
);

export const updateAccount = createAsyncThunk<
  User,
  Partial<User>
>(
  "user/updateAccount",
  async (props, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.put(
        backendRoutes.dashboard.user.updateAccount,
        props,
        backendAxiosConfig({ type: 'multipart/form-data' })
      ),
      rejectWithValue
    })
  }
);

export const updateEmail = createAsyncThunk<
  void,
  { newEmail: string }
>(
  "user/updateEmail",
  async (props, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.put(
        backendRoutes.dashboard.user.updateEmail,
        props,
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const resendEmailUpdateToken = createAsyncThunk<
  void,
  { email: string }
>(
  "user/resendEmailUpdateToken",
  async (props, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(
        backendRoutes.dashboard.user.resendEmailUpdateToken,
        props,
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const verifyEmailUpdate = createAsyncThunk<
  void,
  { verificationCode: string, newEmail: string }
>(
  "user/verifyEmailUpdate",
  async (props, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(
        backendRoutes.dashboard.user.verifyEmailUpdate,
        props,
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.delete(
        backendRoutes.dashboard.user.deleteAccount,
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const submitSupportTicket = createAsyncThunk<
  void,
  SupportTicket
>(
  "user/submitSupportTicket",
  async (props, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(
        backendRoutes.dashboard.user.submitSupportTicket,
        props,
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const { logoutUser, refreshUser, clearUserStatus, modifyUserDetails, clearUserStateStatus, clearSupportTicket } = userSlice.actions;
export default userSlice.reducer;