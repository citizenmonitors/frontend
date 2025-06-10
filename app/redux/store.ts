import { configureStore } from "@reduxjs/toolkit";
import signupSlice from "./features/signupSlice";
import alertSlice from "./features/alertSlice";
import userSlice from "./features/userSlice";
import electionSlice from "./features/electionSlice";
import liveElectionSlice from "./features/liveElectionSlice";
import activitySlice from "./features/activitySlice";
import inboxSlice from "./features/inboxSlice";
import adminDashboardSlice from "./admin-features/dashboardSlice";
import adminElectionSlice from "./admin-features/electionSlice";
import adminUploadSlice from "./admin-features/uploadSlice";
import adminFlaggedUploadSlice from "./admin-features/flaggedUploadSlice";
import adminUserSlice from "./admin-features/userSlice";
import adminVerificationSlice from "./admin-features/verificationSlice";
import adminActivityLogSlice from "./admin-features/activityLogSlice";
import adminAdminSlice from "./admin-features/adminSlice";
import outboxSlice from "./admin-features/outboxSlice";
import notificationSlice from "./admin-features/notificationSlice";

const store = configureStore({
  reducer: {
    signup: signupSlice,
    alert: alertSlice,
    user: userSlice,
    election: electionSlice,
    liveElection: liveElectionSlice,
    activity: activitySlice,
    inbox: inboxSlice,
    adminDashboard: adminDashboardSlice,
    adminElection: adminElectionSlice,
    adminUpload: adminUploadSlice,
    adminFlaggedUpload: adminFlaggedUploadSlice,
    adminUser: adminUserSlice,
    adminVerification: adminVerificationSlice,
    adminActivityLog: adminActivityLogSlice,
    adminAdmin: adminAdminSlice,
    adminOutbox: outboxSlice,
    adminNotification: notificationSlice,
  }
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;