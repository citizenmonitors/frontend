import { email } from '@/app/data/links';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchState, User, UserRole } from "../types";
import axios from "axios";
import backendAxiosConfig from "@/app/data/axiosConfig";
import { backendRoutes } from "@/app/data/backend";
import { RcFile } from "antd/es/upload";
import handleStateError from "../helpers/handleStateError";
import fetchInThunk from "../helpers/fetchInThunk";
import Cookies from "js-cookie";
import { cookieData } from '@/app/data/cookieData';

type InitialSignupState = {
  error: { message: string | null },
  isObserverAllowed: boolean | null,
  status: {
    emailRegistration: FetchState,
    emailVerification: FetchState,
    detailsSubmission: FetchState,
    roleSelection: FetchState,
    roleSubmission: FetchState,
  },
};

const initialState: InitialSignupState = {
  error: { message: null },
  isObserverAllowed: null,
  status: {
    emailRegistration: 'not started',
    emailVerification: 'not started',
    detailsSubmission: 'not started',
    roleSelection: 'not started',
    roleSubmission: 'not started',
  },
}

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    clearSignupState(state) {
      state.error.message = null;
      state.status = initialState.status;
      state.isObserverAllowed = initialState.isObserverAllowed;
    },
  },
  extraReducers: (builder) => {
    // Register User Email and Password
    builder.addCase(registerUser.pending, (state) => {
      state.status.emailRegistration = 'pending';
    });
    builder.addCase(registerUser.rejected, (state, action: any) => {
      state.status.emailRegistration = 'rejected';
      handleStateError(state, action);
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.status.emailRegistration = 'fulfilled';
    });

    // Verify OTP Code
    builder.addCase(verifyOTP.pending, (state) => {
      state.status.emailVerification = 'pending';
    });
    builder.addCase(verifyOTP.rejected, (state, action: any) => {
      state.status.emailVerification = 'rejected';
      handleStateError(state, action);
    });
    builder.addCase(verifyOTP.fulfilled, (state) => {
      state.status.emailVerification = 'fulfilled';
    });

    // Submit Details
    builder.addCase(submitDetails.pending, (state) => {
      state.status.detailsSubmission = 'pending';
    });
    builder.addCase(submitDetails.rejected, (state, action: any) => {
      state.status.detailsSubmission = 'rejected';
      handleStateError(state, action);
    });
    builder.addCase(submitDetails.fulfilled, (state, action) => {
      state.status.detailsSubmission = 'fulfilled';
      state.isObserverAllowed = !action.payload.isObserverInPollingUnit;
    });

    // Select Role
    builder.addCase(selectRole.pending, (state) => {
      state.status.roleSelection = 'pending';
    });
    builder.addCase(selectRole.rejected, (state, action: any) => {
      state.status.roleSelection = 'rejected';
      handleStateError(state, action);
    });
    builder.addCase(selectRole.fulfilled, (state, action) => {
      state.status.roleSelection = 'fulfilled';

      const selectedRole = action.meta.arg.user.role;
      if (selectedRole === 'volunteer') {
        Cookies.set(
          cookieData.login.name,
          action.payload.token,
          { expires: cookieData.login.expiration }
        );
      }
    });

    // Submit Role
    builder.addCase(submitRole.pending, (state) => {
      state.status.roleSubmission = 'pending';
    });
    builder.addCase(submitRole.rejected, (state, action: any) => {
      state.status.roleSubmission = 'rejected';
      handleStateError(state, action);
    });
    builder.addCase(submitRole.fulfilled, (state, action) => {
      state.status.roleSubmission = 'fulfilled';

      console.log("selecting role.. setting cookie...")
      const cookie = Cookies.set(
        cookieData.login.name,
        action.payload.token,
        { expires: cookieData.login.expiration }
      );
      console.log("Cookie set: ", cookie)
    });
  }
});

type RegisterResponse = {
  message: string;
}

export const registerUser = createAsyncThunk<RegisterResponse, { email: string, password: string, confirmPassword: string }>(
  "signup/registerUser",
  async (registerProps, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(backendRoutes.auth.register, registerProps, backendAxiosConfig()),
      rejectWithValue
    });
  }
);

export const verifyOTP = createAsyncThunk<void, { email: string, verificationCode: string }>(
  "signup/verifyOTP",
  async (verifyProps, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(backendRoutes.auth.verifyEmail, verifyProps, backendAxiosConfig()),
      rejectWithValue
    });
  }
);

export const resendVerificationToken = createAsyncThunk<void, { email: string }>(
  "signup/resendVerificationToken",
  async (emailProps, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(backendRoutes.auth.resendEmailVerificationToken, emailProps, backendAxiosConfig()),
      rejectWithValue
    });
  }
);

type SubmitDetailsResponse = { isObserverInPollingUnit: boolean };
export const submitDetails = createAsyncThunk<SubmitDetailsResponse, { user: Partial<User> }>(
  "signup/submitDetails",
  async ({ user }, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(backendRoutes.auth.submitDetails, user, backendAxiosConfig({ type: 'multipart/form-data' })),
      rejectWithValue
    });
  }
)

// end of volunteer signup
type SelectRoleResponse = {
  token: string;
  user: User;
}
export const selectRole = createAsyncThunk<SelectRoleResponse, {
  user: {
    role: UserRole, email: string
  }
}>(
  "signup/selectRole",
  async ({ user }, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(backendRoutes.auth.selectRole, user, backendAxiosConfig()),
      rejectWithValue
    });
  }
);

// end of observer signup
type SubmitRoleResponse = {
  token: string;
  user: User;
};
export const submitRole = createAsyncThunk<SubmitRoleResponse, { user: Partial<User> }>(
  "signup/submitRole",
  async ({ user }, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(backendRoutes.auth.submitRole, user, backendAxiosConfig({ type: 'multipart/form-data' })),
      rejectWithValue
    });
  }
)

export const { clearSignupState } = signupSlice.actions;
export default signupSlice.reducer;