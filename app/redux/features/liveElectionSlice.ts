import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BaseLiveElectionResult, FetchState, LiveElection } from "../types";
import fetchInThunk from "../helpers/fetchInThunk";
import axios from "axios";
import { backendRoutes } from "@/app/data/backend";
import backendAxiosConfig from "@/app/data/axiosConfig";
import handleStateError from "../helpers/handleStateError";
import colors from "@/app/data/colors";
import copyObject from "@/app/utils/copyObject";

export const PARTY_COLOR_LIST = colors;

export const emptyLiveElection: LiveElection = {
  electionDetails: { electionType: '', electionName: '', startDate: '', endDate: '', mockElection: false, electionLocation: '' },
  result: null,
  incidentReport: null,
  sentimentAnalysis: null,
  partyColors: {},
}

type InitialLiveElectionState = {
  data: LiveElection | null;
  status: {
    fetchLiveElection: FetchState
  };
  error: {
    message: string | null;
  }
}

const initialState: InitialLiveElectionState = {
  data: null,
  status: {
    fetchLiveElection: "fulfilled"
  },
  error: {
    message: null
  }
}

const liveElectionSlice = createSlice({
  name: 'live-election',
  initialState,
  reducers: {
    clearLiveElection: (state) => {
      state.data = emptyLiveElection;
      state.status.fetchLiveElection = "not started";
      state.error.message = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Live Election By Id
    builder.addCase(getLiveElectionById.pending, (state) => {
      state.status.fetchLiveElection = "pending";
    });
    builder.addCase(getLiveElectionById.fulfilled, (state, action) => {
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

      state.data = newLiveElection;
      state.status.fetchLiveElection = "fulfilled";
    });
    builder.addCase(getLiveElectionById.rejected, (state, action: any) => {
      state.status.fetchLiveElection = "rejected";
      handleStateError(state, action);
    });
  }
})

export const getLiveElectionById = createAsyncThunk<LiveElection, string>('live-election/fetchLiveElection', async (electionId, { rejectWithValue }) => {
  return await fetchInThunk({
    asyncCallback: () => axios.get(backendRoutes.dashboard.elections.getLiveById(electionId), backendAxiosConfig()),
    rejectWithValue
  });
})

export const { clearLiveElection } = liveElectionSlice.actions;
export default liveElectionSlice.reducer;
