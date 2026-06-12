import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { backendRoutes } from "@/app/data/backend";
import backendAxiosConfig from "@/app/data/axiosConfig";
import fetchInThunk from "../helpers/fetchInThunk";
import handleStateError from "../helpers/handleStateError";
import { FetchState, PvcIssueReport } from "../types";

type InitialPvcIssuesState = {
  status: {
    submitReport: FetchState;
  };
  error: {
    message: string | null;
  };
};

const initialState: InitialPvcIssuesState = {
  status: {
    submitReport: "not started",
  },
  error: {
    message: null,
  },
};

function buildPvcIssueFormData(report: PvcIssueReport): FormData {
  const formData = new FormData();
  formData.append("fullName", report.fullName);
  formData.append("phoneNumber", report.phoneNumber);

  if (report.email?.trim()) {
    formData.append("email", report.email.trim());
  }

  formData.append("state", report.state);
  formData.append("lga", report.lga);
  formData.append("pollingUnit", report.pollingUnit);
  formData.append("issueType", report.issueType);

  if (report.otherIssueDetail?.trim()) {
    formData.append("otherIssueDetail", report.otherIssueDetail.trim());
  }

  formData.append("description", report.description);
  formData.append("consent", String(report.consent));
  formData.append("consentText", report.consentText);

  report.evidence.forEach((file) => formData.append("evidence", file, file.name));

  return formData;
}

export const submitPvcIssueReport = createAsyncThunk<void, PvcIssueReport>(
  "pvc-issues/submitReport",
  async (report, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () =>
        axios.post(
          backendRoutes.pvcIssues.submit,
          buildPvcIssueFormData(report),
          backendAxiosConfig({ type: "multipart/form-data" })
        ),
      rejectWithValue,
    });
  }
);

const pvcIssuesSlice = createSlice({
  name: "pvc-issues",
  initialState,
  reducers: {
    clearPvcIssueSubmission(state) {
      state.status.submitReport = "not started";
      state.error.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPvcIssueReport.pending, (state) => {
        state.status.submitReport = "pending";
      })
      .addCase(submitPvcIssueReport.fulfilled, (state) => {
        state.status.submitReport = "fulfilled";
      })
      .addCase(
        submitPvcIssueReport.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.status.submitReport = "rejected";
          
        }
      );
  },
});

export const { clearPvcIssueSubmission } = pvcIssuesSlice.actions;
export default pvcIssuesSlice.reducer;