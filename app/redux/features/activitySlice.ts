import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ActivityNotification, FetchState, ActivityLiveElection, BaseLiveElectionResult } from "../types";
import fetchInThunk from "../helpers/fetchInThunk"
import axios from "axios"
import { backendRoutes } from '@/app/data/backend';
import backendAxiosConfig from '@/app/data/axiosConfig';
import colors from "@/app/data/colors";

const PARTY_COLOR_LIST = colors;
type InitialActivityState = {
  activityBoard: {
    totalResultsSubmitted: number,
    observerSubmissions: number,
    volunteerSubmissions: number,
    approvedObserverSubmissions: number,
  },
  activityNotifications: Array<ActivityNotification>,
  activityLiveResult: null | ActivityLiveElection,
  status: {
    fetchActivityData: FetchState,
    fetchSingleLiveResult: FetchState,
  }
}

const initialState: InitialActivityState = {
  activityBoard: {
    totalResultsSubmitted: 0,
    observerSubmissions: 0,
    volunteerSubmissions: 0,
    approvedObserverSubmissions: 0,
  },
  activityNotifications: [],
  activityLiveResult: null,
  status: {
    fetchActivityData: 'not started',
    fetchSingleLiveResult: 'not started',
  }
}

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    clearActivityData: (state) => {
      state.activityBoard = {
        totalResultsSubmitted: 0,
        observerSubmissions: 0,
        volunteerSubmissions: 0,
        approvedObserverSubmissions: 0,
      }
      state.activityNotifications = []
      state.status.fetchActivityData = 'not started'
    },
    clearSingleLiveResult: (state) => {
      state.activityLiveResult = null,
        state.status.fetchSingleLiveResult = 'not started'
    }
  },
  extraReducers: (builder) => {
    // Fetch Activity Data
    builder.addCase(getActivityData.pending, (state) => {
      state.status.fetchActivityData = 'pending'
    });
    builder.addCase(getActivityData.fulfilled, (state, action) => {
      const board = action.payload.activityBoard;
      state.activityBoard = {
        totalResultsSubmitted: board["all the total result submitted"],
        observerSubmissions: board["all the total result submitted by observer"],
        volunteerSubmissions: board["all the total result submitted by volunteer"],
        approvedObserverSubmissions: board["all the total approved result"],
      }
      state.activityNotifications = action.payload.notifications;
      state.status.fetchActivityData = 'fulfilled';
    });
    builder.addCase(getActivityData.rejected, (state) => {
      state.status.fetchActivityData = 'rejected';
    });

    // Fetch Single Live Result
    builder.addCase(getSingleLiveResult.pending, (state) => {
      state.status.fetchSingleLiveResult = 'pending';
    });
    builder.addCase(getSingleLiveResult.fulfilled, (state, action) => {
      const { result } = action.payload;

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

        state.activityLiveResult = {
          ...action.payload,
          partyColors
        };
      }
      state.status.fetchSingleLiveResult = 'fulfilled';
    });
    builder.addCase(getSingleLiveResult.rejected, (state) => {
      state.status.fetchSingleLiveResult = 'rejected';
    });
  }
});

export const getActivityData = createAsyncThunk<{
  activityBoard: {
    "all the total result submitted": number;
    "all the total result submitted by observer": number;
    "all the total result submitted by volunteer": number;
    "all the total approved result": number;
  },
  notifications: Array<ActivityNotification>
}, void>(
  'activity/fetchActivityData',
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(
        backendRoutes.dashboard.elections.getActivity(),
        backendAxiosConfig()
      ),
      rejectWithValue
    });
  }
);

export const getSingleLiveResult = createAsyncThunk<ActivityLiveElection, void>(
  'activity/fetchSingleLiveElection',
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(
        backendRoutes.dashboard.elections.getSingleLiveResult(),
        backendAxiosConfig()
      ),
      rejectWithValue
    });
  }
);

export const { clearActivityData, clearSingleLiveResult } = activitySlice.actions;
export default activitySlice.reducer;