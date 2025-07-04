import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseLiveElectionResult, Election, FetchState, LiveElection } from "../types"
import fetchInThunk from "../helpers/fetchInThunk";
import axios from "axios";
import backendAxiosConfig from "@/app/data/axiosConfig";
import { backendRoutes } from "@/app/data/backend";
import handleStateError from "../helpers/handleStateError";
import copyObject from "@/app/utils/copyObject";
import { emptyLiveElection, PARTY_COLOR_LIST } from "../features/liveElectionSlice";

type InitialElectionState = {
  elections: Array<Election>;
  electionData: LiveElection | null;
  status: {
    fetchElections: FetchState;
    fetchElection: FetchState;
  };
  error: {
    message: string | null;
  }
}

const initialState: InitialElectionState = {
  elections: [],
  electionData: null,
  status: {
    fetchElections: "not started",
    fetchElection: "not started"
  },
  error: {
    message: null
  }
};

const adminElectionSlice = createSlice({
  name: 'admin-election',
  initialState,
  reducers: {
    clearElectionData: (state) => {
      state.electionData = null;
      state.status.fetchElection = "not started";
    },
    clearElections: (state) => {
      state.elections = initialState.elections;
      state.status.fetchElections = 'not started';
    },
  },
  extraReducers: (builder) => {
    // Fetch Elections
    builder.addCase(getElections.pending, (state) => {
      state.status.fetchElections = 'pending';
    });
    builder.addCase(getElections.fulfilled, (state, action) => {
      state.elections = action.payload.elections;
      state.status.fetchElections = 'fulfilled';
    });
    builder.addCase(getElections.rejected, (state, action: any) => {
      state.status.fetchElections = 'rejected';
      handleStateError(state, action);
    });

    // Fetch Election
    builder.addCase(getElectionById.pending, (state) => {
      state.status.fetchElection = 'pending';
    });
    builder.addCase(getElectionById.fulfilled, (state, action) => {
      const { electionDetails, result, incidentReport, sentimentAnalysis } = action.payload;
      let newLiveElection: LiveElection = Object.assign(copyObject(emptyLiveElection), { electionDetails });

      if (result) {
        const parties = new Set<string>();
        const partyColors: Record<string, string> = {};
        const addLiveResultParties = (liveResult: BaseLiveElectionResult) => {
          Object.entries(liveResult.aggregateAnalysis).forEach(([p]) => {
            parties.add(p);
          })
        }

        if (Array.isArray(result)) {
          result.forEach(addLiveResultParties);
        } else {
          addLiveResultParties(result);
        }
        Array.from(parties).forEach((party, index) => {
          partyColors[party] = PARTY_COLOR_LIST[index] || "#000";
        });

        newLiveElection.result = result;
        newLiveElection.partyColors = partyColors;
      }
      if (incidentReport) newLiveElection.incidentReport = incidentReport;
      if (sentimentAnalysis) newLiveElection.sentimentAnalysis = sentimentAnalysis;

      state.electionData = newLiveElection;
      state.status.fetchElection = "fulfilled";
    });
    builder.addCase(getElectionById.rejected, (state, action: any) => {
      state.status.fetchElection = 'rejected';
      handleStateError(state, action);
    });
  }
});

export const getElections = createAsyncThunk<{ elections: Array<Election> }, void>(
  'admin-election/fetchElections',
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(
        backendRoutes.admin.elections.get,
        backendAxiosConfig()
      ),
      rejectWithValue
    });
  }
);

export const getElectionById = createAsyncThunk<LiveElection, string>(
  'admin-election/fetchElection',
  async (electionId, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(
        backendRoutes.admin.elections.getById(electionId),
        backendAxiosConfig()
      ),
      rejectWithValue
    });
  }
);

export const { clearElectionData, clearElections } = adminElectionSlice.actions;
export default adminElectionSlice.reducer;
