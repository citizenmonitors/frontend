import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	ActiveElection,
  Election,
  ElectionReport,
  ElectionResult,
  ElectionType,
  FetchedElection,
  FetchState,
  PollingUnitReport,
  PollingUnitResult,
  PollingUnitUploadAction,
  PollingUnitUploadType,
} from "../types";
import axios from "axios";
import { backendRoutes } from "@/app/data/backend";
import backendAxiosConfig, {
  backendMultipartAxiosConfig,
} from "@/app/data/axiosConfig";
import fetchInThunk from "../helpers/fetchInThunk";
import handleStateError from "../helpers/handleStateError";

/** Build multipart body so File fields (resultPicture, etc.) are actually sent. */
function toMultipartBody(data: Record<string, unknown>) {
  const cleaned: Record<string, unknown> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      cleaned[key] = value;
    }
  });
  return axios.toFormData(cleaned);
}

type InitialElectionState = {
  elections: Array<Election>;
  electionTypes: Array<ElectionType>;
  electionData: {
    election: Election | null;
    result: ElectionResult | null;
    report: ElectionReport | null;
  };
  uploads: {
    results: Array<ElectionResult>;
    reports: Array<ElectionReport>;
  };
  pollingUnitResults: {
    results: Array<PollingUnitResult>;
    reports: Array<PollingUnitReport>;
    hasSubmitted: boolean | null;
  };
  status: {
    fetchElections: FetchState;
    fetchElectionTypes: FetchState;
    createElection: FetchState;
    deleteElection: FetchState;
    fetchElection: FetchState;
    uploadElectionResult: FetchState;
    uploadElectionReport: FetchState;
    updateElectionResult: FetchState;
    updateElectionReport: FetchState;
    deleteElectionResult: FetchState;
    deleteElectionReport: FetchState;
    fetchUploads: FetchState;
    fetchPollingUnitResults: FetchState;
    fetchFlagPermission: FetchState;
  };
  error: {
    message: string | null;
  };
};

const initialState: InitialElectionState = {
  elections: [],
  electionTypes: [],
  electionData: {
    election: null,
    result: null,
    report: null,
  },
  uploads: {
    results: [],
    reports: [],
  },
  pollingUnitResults: {
    results: [],
    reports: [],
    hasSubmitted: null,
  },
  status: {
    fetchElections: "not started",
    fetchElectionTypes: "not started",
    createElection: "not started",
    fetchElection: "not started",
    deleteElection: "not started",
    uploadElectionResult: "not started",
    uploadElectionReport: "not started",
    updateElectionResult: "not started",
    updateElectionReport: "not started",
    deleteElectionResult: "not started",
    deleteElectionReport: "not started",
    fetchUploads: "not started",
    fetchPollingUnitResults: "not started",
    fetchFlagPermission: "not started",
  },
  error: {
    message: null,
  },
};

const electionSlice = createSlice({
  name: "election",
  initialState,
  reducers: {
    clearElections: (state) => {
      state.elections = initialState.elections;
      state.status.fetchElections = "not started";
    },
    clearElectionState: (state) => {
      state.electionData = initialState.electionData;
      state.status = initialState.status;
      state.error = initialState.error;
    },
    clearElection: (state) => {
      state.electionData = {
        election: null,
        result: null,
        report: null,
      };
      state.status.fetchElection = "not started";
    },
    clearElectionUploadData: (state) => {
      state.electionData = {
        election: null,
        result: null,
        report: null,
      };
      state.status = {
        ...state.status,
        fetchElection: "not started",
        uploadElectionResult: "not started",
        uploadElectionReport: "not started",
        updateElectionResult: "not started",
        updateElectionReport: "not started",
        deleteElectionResult: "not started",
        deleteElectionReport: "not started",
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch Elections
    builder.addCase(getElections.pending, (state) => {
      state.status.fetchElections = "pending";
    });
    builder.addCase(getElections.fulfilled, (state, action) => {
      state.elections = action.payload.elections;
      state.status.fetchElections = "fulfilled";
    });
    builder.addCase(getElections.rejected, (state, action: any) => {
      state.status.fetchElections = "rejected";
      handleStateError(state, action);
    });

    // Fetch Election Types
    builder.addCase(getElectionTypes.pending, (state) => {
      state.status.fetchElectionTypes = "pending";
    });
    builder.addCase(getElectionTypes.fulfilled, (state, action) => {
      state.electionTypes = action.payload.elections;
      state.status.fetchElectionTypes = "fulfilled";
    });
    builder.addCase(getElectionTypes.rejected, (state, action: any) => {
      state.status.fetchElectionTypes = "rejected";
      handleStateError(state, action);
    });

    // Create Election
    builder.addCase(createElection.pending, (state) => {
      state.status.createElection = "pending";
    });
    builder.addCase(createElection.fulfilled, (state) => {
      state.status.createElection = "fulfilled";
    });
    builder.addCase(createElection.rejected, (state, action: any) => {
      state.status.createElection = "rejected";
      handleStateError(state, action);
    });

    // Delete Election
    builder.addCase(deleteElection.pending, (state) => {
      state.status.deleteElection = "pending";
    });
    builder.addCase(deleteElection.fulfilled, (state) => {
      state.status.deleteElection = "fulfilled";
    });
    builder.addCase(deleteElection.rejected, (state, action: any) => {
      state.status.deleteElection = "rejected";
      handleStateError(state, action);
    });

    // Fetch Election
    builder.addCase(getElectionById.pending, (state) => {
      state.status.fetchElection = "pending";
    });
    builder.addCase(getElectionById.fulfilled, (state, action) => {
      const { election } = action.payload;
      const { incidentReports, results } = election;

      state.electionData.result = results[0] || null;
      state.electionData.report = incidentReports[0] || null;
      state.electionData.election = election;
      state.status.fetchElection = "fulfilled";
    });
    builder.addCase(getElectionById.rejected, (state, action: any) => {
      state.status.fetchElection = "rejected";
      handleStateError(state, action);
    });

    // Upload Election Result
    builder.addCase(uploadElectionResult.pending, (state) => {
      state.status.uploadElectionResult = "pending";
    });
    builder.addCase(uploadElectionResult.fulfilled, (state) => {
      state.status.uploadElectionResult = "fulfilled";
    });
    builder.addCase(uploadElectionResult.rejected, (state, action: any) => {
      state.status.uploadElectionResult = "rejected";
      handleStateError(state, action);
    });

    // Upload Election Report
    builder.addCase(uploadElectionReport.pending, (state) => {
      state.status.uploadElectionReport = "pending";
    });
    builder.addCase(uploadElectionReport.fulfilled, (state) => {
      state.status.uploadElectionReport = "fulfilled";
    });
    builder.addCase(uploadElectionReport.rejected, (state, action: any) => {
      state.status.uploadElectionReport = "rejected";
      handleStateError(state, action);
    });

    // Update Election Result
    builder.addCase(updateElectionResult.pending, (state) => {
      state.status.updateElectionResult = "pending";
    });
    builder.addCase(updateElectionResult.fulfilled, (state) => {
      state.status.updateElectionResult = "fulfilled";
    });
    builder.addCase(updateElectionResult.rejected, (state, action: any) => {
      state.status.updateElectionResult = "rejected";
      handleStateError(state, action);
    });

    // Update Election Report
    builder.addCase(updateElectionReport.pending, (state) => {
      state.status.updateElectionReport = "pending";
    });
    builder.addCase(updateElectionReport.fulfilled, (state) => {
      state.status.updateElectionReport = "fulfilled";
    });
    builder.addCase(updateElectionReport.rejected, (state, action: any) => {
      state.status.updateElectionReport = "rejected";
      handleStateError(state, action);
    });

    // Delete Election Result
    builder.addCase(deleteElectionResult.pending, (state) => {
      state.status.deleteElectionResult = "pending";
    });
    builder.addCase(deleteElectionResult.fulfilled, (state) => {
      state.status.deleteElectionResult = "fulfilled";
    });
    builder.addCase(deleteElectionResult.rejected, (state, action: any) => {
      state.status.deleteElectionResult = "rejected";
      handleStateError(state, action);
    });

    // Delete Election Report
    builder.addCase(deleteElectionReport.pending, (state) => {
      state.status.deleteElectionReport = "pending";
    });
    builder.addCase(deleteElectionReport.fulfilled, (state) => {
      state.status.deleteElectionReport = "fulfilled";
    });
    builder.addCase(deleteElectionReport.rejected, (state, action: any) => {
      state.status.deleteElectionReport = "rejected";
      handleStateError(state, action);
    });

    // Fetch Uploads
    builder.addCase(getUploads.pending, (state) => {
      state.status.fetchUploads = "pending";
    });
    builder.addCase(getUploads.fulfilled, (state, action) => {
      state.status.fetchUploads = "fulfilled";
      state.uploads.results = action.payload.data.electionResults;
      state.uploads.reports = action.payload.data.incidentReports;
    });
    builder.addCase(getUploads.rejected, (state, action: any) => {
      state.status.fetchUploads = "rejected";
      handleStateError(state, action);
    });

    // Fetch Polling Unit Results
    builder.addCase(getPollingUnitResults.pending, (state) => {
      state.status.fetchPollingUnitResults = "pending";
    });
    builder.addCase(getPollingUnitResults.fulfilled, (state, action) => {
      state.status.fetchPollingUnitResults = "fulfilled";
      state.pollingUnitResults.results = action.payload.results.results.map((result) => ({
				...result,
				election: {
					...result.election,
					electionName: result.electionName,
				}
			})) || [];
      state.pollingUnitResults.reports =
        action.payload.results.incidentReports || [];
    });
    builder.addCase(getPollingUnitResults.rejected, (state, action: any) => {
      state.status.fetchPollingUnitResults = "rejected";
      handleStateError(state, action);
    });

    // Fetch Flag Permission
    builder.addCase(getFlagPermission.pending, (state) => {
      state.status.fetchFlagPermission = "pending";
      state.pollingUnitResults.hasSubmitted = null;
    });
    builder.addCase(getFlagPermission.fulfilled, (state, action) => {
      state.status.fetchFlagPermission = "fulfilled";
      state.pollingUnitResults.hasSubmitted = action.payload.isUploaded;
    });
    builder.addCase(getFlagPermission.rejected, (state, action: any) => {
      state.status.fetchFlagPermission = "rejected";
      handleStateError(state, action);
    });
  },
});

export const getElections = createAsyncThunk<
  { elections: Array<Election> },
  void
>("election/fetchElections", async (_, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: () =>
      axios.get(backendRoutes.dashboard.elections.get, backendAxiosConfig()),
    rejectWithValue,
  });
});

export const getElectionTypes = createAsyncThunk<
  { elections: Array<ElectionType> },
  void
>("election/fetchElectionTypes", async (_, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: () =>
      axios.get(
        backendRoutes.dashboard.elections.getTypes,
        backendAxiosConfig()
      ),
    rejectWithValue,
  });
});

export const createElection = createAsyncThunk<
  void,
  ActiveElection & { electionId: string }
>("election/createElection", async (election, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: () =>
      axios.post(
        backendRoutes.dashboard.elections.create,
        election,
        backendAxiosConfig()
      ),
    rejectWithValue,
  });
});

export const deleteElection = createAsyncThunk<void, string>(
  "election/deleteElection",
  async (electionId, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () =>
        axios.delete(
          backendRoutes.dashboard.elections.delete(electionId),
          backendAxiosConfig()
        ),
      rejectWithValue,
    });
  }
);

export const getElectionById = createAsyncThunk<
  {
    election: FetchedElection;
  },
  string
>("election/fetchElection", async (electionId, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: () =>
      axios.get(
        backendRoutes.dashboard.elections.getById(electionId),
        backendAxiosConfig()
      ),
    rejectWithValue,
  });
});

export const uploadElectionResult = createAsyncThunk<
  void,
  { electionId: string; result: ElectionResult }
>(
  "election/uploadResult",
  async ({ electionId, result }, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () =>
        axios.post(
          backendRoutes.dashboard.elections.uploadResult(electionId),
          toMultipartBody(result as unknown as Record<string, unknown>),
          backendMultipartAxiosConfig()
        ),
      rejectWithValue,
    });
  }
);

export const updateElectionResult = createAsyncThunk<
  void,
  { electionId: string; result: Partial<ElectionResult> }
>(
  "election/updateResult",
  async ({ electionId, result }, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () =>
        axios.put(
          backendRoutes.dashboard.elections.updateResult(electionId),
          toMultipartBody(result as unknown as Record<string, unknown>),
          backendMultipartAxiosConfig()
        ),
      rejectWithValue,
    });
  }
);

export const deleteElectionResult = createAsyncThunk<
  void,
  { electionId: string }
>("election/deleteResult", async ({ electionId }, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: () =>
      axios.delete(
        backendRoutes.dashboard.elections.deleteResult(electionId),
        backendAxiosConfig()
      ),
    rejectWithValue,
  });
});

export const uploadElectionReport = createAsyncThunk<
  void,
  { electionId: string; report: ElectionReport }
>(
  "election/uploadReport",
  async ({ electionId, report }, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () =>
        axios.post(
          backendRoutes.dashboard.elections.uploadReport(electionId),
          toMultipartBody(report as unknown as Record<string, unknown>),
          backendMultipartAxiosConfig()
        ),
      rejectWithValue,
    });
  }
);

export const updateElectionReport = createAsyncThunk<
  void,
  { electionId: string; report: Partial<ElectionReport> }
>(
  "election/updateReport",
  async ({ electionId, report }, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () =>
        axios.put(
          backendRoutes.dashboard.elections.updateReport(electionId),
          toMultipartBody(report as unknown as Record<string, unknown>),
          backendMultipartAxiosConfig()
        ),
      rejectWithValue,
    });
  }
);

export const deleteElectionReport = createAsyncThunk<
  void,
  { electionId: string }
>("election/deleteReport", async ({ electionId }, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: () =>
      axios.delete(
        backendRoutes.dashboard.elections.deleteReport(electionId),
        backendAxiosConfig()
      ),
    rejectWithValue,
  });
});

export const getUploads = createAsyncThunk<
  {
    data: {
      electionResults: Array<ElectionResult>;
      incidentReports: Array<ElectionReport>;
    };
  },
  void
>("election/fetchUploads", async (_, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: () =>
      axios.get(
        backendRoutes.dashboard.elections.fetchUploads(),
        backendAxiosConfig()
      ),
    rejectWithValue,
  });
});

export const getPollingUnitResults = createAsyncThunk<
  {
    results: {
      results: Array<PollingUnitResult>;
      incidentReports: Array<PollingUnitReport>;
    };
  },
  {
    actionProps?: {
      electionId: string;
      action: PollingUnitUploadAction;
      dataType: PollingUnitUploadType;
      flagReason?: string;
    };
  }
>(
  "election/fetchPollingUnitResults",
  async ({ actionProps }, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () =>
        axios.post(
          backendRoutes.dashboard.elections.getPollingUnitResults(),
          actionProps,
          backendAxiosConfig()
        ),
      rejectWithValue,
    });
  }
);

export const getFlagPermission = createAsyncThunk<
  {
    isUploaded: boolean;
  },
  {
    props?: {
      electionId: string;
      action: string;
      dataType: string;
    };
  }
>("election/fetchFlagPermission", async ({ props }, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: () =>
      axios.post(
        backendRoutes.dashboard.elections.getFlagPermission(),
        props,
        backendAxiosConfig()
      ),
    rejectWithValue,
  });
});

export const {
  clearElections,
  clearElection,
  clearElectionUploadData,
  clearElectionState,
} = electionSlice.actions;
export default electionSlice.reducer;
