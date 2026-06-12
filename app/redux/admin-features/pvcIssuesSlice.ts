import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { backendRoutes } from "@/app/data/backend";
import backendAxiosConfig from "@/app/data/axiosConfig";
import fetchInThunk from "../helpers/fetchInThunk";
import handleStateError from "../helpers/handleStateError";
import { FetchState } from "../types";

export type AdminTablePvcIssue = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  state: string;
  lga: string;
  pollingUnit: string;
  issueType: string;
  createdAt: string;
};

export type AdminPvcIssueDetail = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  state: string;
  lga: string;
  pollingUnit: string;
  issueType: string;
  otherIssueDetail?: string;
  description: string;
  consentGiven: boolean;
  consentText: string;
  consentedAt: string;
  createdAt: string;
  updatedAt: string;
  evidence: Array<{
    index: number;
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
};

type InitialAdminPvcIssuesState = {
  reports: Array<AdminTablePvcIssue>;
  report: AdminPvcIssueDetail | null;
  status: {
    fetchReports: FetchState;
    fetchReport: FetchState;
  };
  error: {
    message: string | null;
  };
};

const initialState: InitialAdminPvcIssuesState = {
  reports: [],
  report: null,
  status: {
    fetchReports: "not started",
    fetchReport: "not started",
  },
  error: {
    message: null,
  },
};

const adminPvcIssuesSlice = createSlice({
  name: "admin-pvc-issues",
  initialState,
  reducers: {
    clearPvcIssueReport(state) {
      state.report = null;
      state.status.fetchReport = "not started";
      state.error.message = null;
    },
    clearPvcIssueReports(state) {
      state.reports = [];
      state.status.fetchReports = "not started";
      state.error.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPvcIssueReports.pending, (state) => {
        state.status.fetchReports = "pending";
      })
      .addCase(getPvcIssueReports.fulfilled, (state, action) => {
        state.reports = action.payload;
        state.status.fetchReports = "fulfilled";
      })
      .addCase(getPvcIssueReports.rejected, (state, action: any) => {
        state.status.fetchReports = "rejected";
        handleStateError(state, action);
      });

    builder
      .addCase(getPvcIssueReport.pending, (state) => {
        state.status.fetchReport = "pending";
      })
      .addCase(getPvcIssueReport.fulfilled, (state, action) => {
        state.report = action.payload;
        state.status.fetchReport = "fulfilled";
      })
      .addCase(getPvcIssueReport.rejected, (state, action: any) => {
        state.status.fetchReport = "rejected";
        handleStateError(state, action);
      });
  },
});



type AdminPvcIssuesListResponse =
  | Array<AdminTablePvcIssue>
  | {
      results?: { reports?: Array<AdminTablePvcIssue> };
      reports?: Array<AdminTablePvcIssue>;
      data?: Array<AdminTablePvcIssue>;
    };

function normalizeReportsResponse(data: AdminPvcIssuesListResponse): Array<AdminTablePvcIssue> {
  if (Array.isArray(data)) return data;
  return data.results?.reports ?? data.reports ?? data.data ?? [];
}

type AdminPvcIssueDetailResponse =
  | AdminPvcIssueDetail
  | {
      results?: { report?: AdminPvcIssueDetail };
      report?: AdminPvcIssueDetail;
      data?: AdminPvcIssueDetail;
    };

function normalizeReportResponse(data: AdminPvcIssueDetailResponse): AdminPvcIssueDetail {
  if ("fullName" in data) return data as AdminPvcIssueDetail; // flat object
  const wrapped = data as {
    results?: { report?: AdminPvcIssueDetail };
    report?: AdminPvcIssueDetail;
    data?: AdminPvcIssueDetail;
  };
  return wrapped.results?.report ?? wrapped.report ?? wrapped.data ?? (data as AdminPvcIssueDetail);
}

export const getPvcIssueReports = createAsyncThunk<AdminTablePvcIssue[], void>(
  "admin-pvc-issues/getReports",
  async (_, { rejectWithValue }) => {
    const data = await fetchInThunk({
      asyncCallback: () =>
        axios.get<AdminPvcIssuesListResponse>(
          backendRoutes.admin.pvcIssues.get,
          backendAxiosConfig()
        ),
      rejectWithValue,
    });
    return normalizeReportsResponse(data as AdminPvcIssuesListResponse);
  }
);

export const getPvcIssueReport = createAsyncThunk<AdminPvcIssueDetail, string>(
  "admin-pvc-issues/getReport",
  async (reportId, { rejectWithValue }) => {
    const data = await fetchInThunk({
      asyncCallback: () =>
        axios.get<AdminPvcIssueDetailResponse>(
          backendRoutes.admin.pvcIssues.getById(reportId),
          backendAxiosConfig()
        ),
      rejectWithValue,
    });
    return normalizeReportResponse(data as AdminPvcIssueDetailResponse);
  }
);

export const { clearPvcIssueReport, clearPvcIssueReports } =
  adminPvcIssuesSlice.actions;
export default adminPvcIssuesSlice.reducer;