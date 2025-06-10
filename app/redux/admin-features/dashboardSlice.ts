import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AdminDashboardGraphs, FetchState, MonthComparison } from "../types"
import fetchInThunk from "../helpers/fetchInThunk";
import axios from "axios";
import { backendRoutes } from "@/app/data/backend";
import backendAxiosConfig from "@/app/data/axiosConfig";

type InitialDashboardState = {
  graphs: AdminDashboardGraphs,
  status: {
    fetchGraphData: FetchState,
  }
};

const initialState: InitialDashboardState = {
  graphs: {
    registeredUsers: { count: 0, data: [0, 0, 0, 0, 0, 0, 0], lastMonthComparison: 0 },
    observers: { count: 0, data: [0, 0, 0, 0, 0, 0, 0], lastMonthComparison: 0 },
    activeUsers: { count: 0, data: [0, 0, 0, 0, 0, 0, 0], lastMonthComparison: 0 },
    resultsUploaded: { count: 0, data: [0, 0, 0, 0, 0, 0, 0], lastMonthComparison: 0 },
    userInfo: {
      gender: [{ name: 'female', count: 0 }, { name: 'male', count: 0 }],
      roles: [{ name: 'volunteer', count: 0 }, { name: 'observer', count: 0 },]
    },
    admins: [],
    dailyTraffic: { count: 0, data: [0, 0, 0, 0, 0, 0, 0], lastMonthComparison: 0 },
  },
  status: {
    fetchGraphData: 'not started',
  }
};

const adminDashboardSlice = createSlice({
  name: 'admin-dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Graph Data
    builder.addCase(getGraphData.pending, (state) => {
      state.status.fetchGraphData = 'pending'
    });
    builder.addCase(getGraphData.fulfilled, (state, action) => {
      const fetchedGraphs = action.payload;
      function formatCountToNumber(com: MonthComparison) {
        if (typeof com.lastMonthComparison === 'string') {
          return {
            ...com,
            lastMonthComparison: Number(com.lastMonthComparison.slice(0, -1)),
          }
        }
        return com;
      }

      state.graphs = {
        ...fetchedGraphs,
        registeredUsers: formatCountToNumber(fetchedGraphs.registeredUsers!),
        observers: formatCountToNumber(fetchedGraphs.observers!),
        activeUsers: formatCountToNumber(fetchedGraphs.activeUsers!),
        resultsUploaded: formatCountToNumber(fetchedGraphs.resultsUploaded!),
        dailyTraffic: formatCountToNumber(fetchedGraphs.dailyTraffic!),
      }
      state.status.fetchGraphData = 'fulfilled';
    });
    builder.addCase(getGraphData.rejected, (state) => {
      state.status.fetchGraphData = 'rejected'
    });
  }
});

export const getGraphData = createAsyncThunk<AdminDashboardGraphs, void>(
  'admin-dashboard/fetchGraphData',
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(
        backendRoutes.admin.dashboard.getDashboard(),
        backendAxiosConfig()
      ),
      rejectWithValue
    });
  }
);

export const { } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;