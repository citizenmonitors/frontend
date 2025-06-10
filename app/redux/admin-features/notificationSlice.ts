import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AdminNotification, FetchState } from "../types";
import fetchInThunk from "../helpers/fetchInThunk";
import axios from "axios";
import { backendRoutes } from "@/app/data/backend";
import backendAxiosConfig from "@/app/data/axiosConfig";
import handleStateError from "../helpers/handleStateError";

type InitialNotificationState = {
  notifications: AdminNotification[];
  status: {
    getNotifications: FetchState;
    markRead: FetchState;
    deleteNotification: FetchState;
  };
  error: {
    message: string | null;
  };
};
const initialState: InitialNotificationState = {
  notifications: [],
  status: {
    getNotifications: "not started",
    markRead: "not started",
    deleteNotification: "not started",
  },
  error: {
    message: null,
  },
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotifications() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Get All Notifications
    builder.addCase(getNotifications.pending, (state) => {
      state.status.getNotifications = "pending";
    });
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.status.getNotifications = "fulfilled";
      state.notifications = action.payload;
    });
    builder.addCase(getNotifications.rejected, (state, action: any) => {
      state.status.getNotifications = "rejected";
      handleStateError(state, action);
    });

    // Mark Notification as Read
    builder.addCase(markNotificationAsRead.pending, (state) => {
      state.status.markRead = "pending";
    });
    builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
      state.status.markRead = "fulfilled";
      state.notifications = state.notifications.map((notification) => {
        if (notification._id === action.meta.arg) {
          return { ...notification, read: true };
        }
        return notification;
      });
    });
    builder.addCase(markNotificationAsRead.rejected, (state, action: any) => {
      state.status.markRead = "rejected";
      handleStateError(state, action);
    });

    // Delete Notification
    builder.addCase(deleteNotification.pending, (state) => {
      state.status.deleteNotification = "pending";
    });
    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      state.status.deleteNotification = "fulfilled";
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.meta.arg
      );
    });
    builder.addCase(deleteNotification.rejected, (state, action: any) => {
      state.status.deleteNotification = "rejected";
      handleStateError(state, action);
    });
  },
});

export const getNotifications = createAsyncThunk<Array<AdminNotification>, void>(
  "notification/getNotifications",
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () =>
        axios.get(backendRoutes.admin.notifications.get, backendAxiosConfig()),
      rejectWithValue,
    });
  }
);

export const markNotificationAsRead = createAsyncThunk<
  { message: string },
  string
>("notification/markNotificationAsRead", async (id: string, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: () =>
      axios.patch(backendRoutes.admin.notifications.markRead(id), {}, backendAxiosConfig()),
    rejectWithValue,
  });
});

export const deleteNotification = createAsyncThunk<
  { message: string },
  string
>("notification/deleteNotification", async (id: string, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: () =>
      axios.patch(backendRoutes.admin.notifications.delete(id), {}, backendAxiosConfig()),
    rejectWithValue,
  });
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;