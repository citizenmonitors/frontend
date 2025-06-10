import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AdminUserGraphs, FetchState, MonthComparison, User } from "../types"
import fetchInThunk from "../helpers/fetchInThunk";
import { backendRoutes } from "@/app/data/backend";
import backendAxiosConfig from "@/app/data/axiosConfig";
import axios from "axios";
import handleStateError from "../helpers/handleStateError";

export type AdminTableUser = Pick<
  User,
  | "_id"
  | "role"
  | "email"
  | "firstName"
  | "lastName"
  | "createdAt"
  | "gender"
  | "state"
  | "pendingObserverVerification"
>;

type InitialUserState = {
  graphs: AdminUserGraphs,
  users: Array<AdminTableUser>,
  user: User | null,
  status: {
    fetchUsers: FetchState,
    fetchUser: FetchState,
    deleteUser: FetchState,
  },
  error: {
    message: string | null;
  }
}

const initialState: InitialUserState = {
  graphs: {
    registeredUsers: { count: 0, data: [0, 0, 0, 0, 0, 0, 0], lastMonthComparison: 0 },
    userInfo: {
      gender: [{ name: 'female', count: 0 }, { name: 'male', count: 0 }],
      roles: [{ name: 'volunteer', count: 0 }, { name: 'observer', count: 0 },]
    },
  },
  users: [],
  user: null,
  status: {
    fetchUsers: 'not started',
    fetchUser: 'not started',
    deleteUser: 'not started',
  },
  error: {
    message: null
  }
};

const adminUserSlice = createSlice({
  name: 'admin-user',
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
      state.status.fetchUser = 'not started';
      state.status.deleteUser = 'not started';
      state.error.message = null;
    },
    clearUsers(state) {
      state.users = [];
      state.status.fetchUsers = 'not started';
      state.error.message = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder.addCase(getUsers.pending, (state) => {
      state.status.fetchUsers = 'pending'
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      const { users, registeredUsers, userInfo } = action.payload.results;
      function formatCountToNumber(com: MonthComparison) {
        if (typeof com.lastMonthComparison === 'string') {
          return {
            ...com,
            lastMonthComparison: Number(com.lastMonthComparison.slice(0, -1)),
          }
        }
        return com;
      }

      state.graphs = { registeredUsers: formatCountToNumber(registeredUsers), userInfo };
      state.users = users;
      state.status.fetchUsers = 'fulfilled';
    });
    builder.addCase(getUsers.rejected, (state, action: any) => {
      state.status.fetchUsers = 'rejected';
      handleStateError(state, action);
    });

    // Fetch User
    builder.addCase(getUser.pending, (state) => {
      state.status.fetchUser = 'pending';
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.status.fetchUser = 'fulfilled';
    });
    builder.addCase(getUser.rejected, (state, action: any) => {
      state.status.fetchUser = 'rejected';
      handleStateError(state, action);
    });

    // Delete User
    builder.addCase(deleteUser.pending, (state) => {
      state.status.deleteUser = 'pending';
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter(user => user._id !== action.meta.arg);
      state.status.deleteUser = 'fulfilled';
    });
    builder.addCase(deleteUser.rejected, (state, action: any) => {
      state.status.deleteUser = 'rejected';
      handleStateError(state, action);
    });
  }
});

type AdminUserResponse = {
  results: {
    registeredUsers: MonthComparison,
    userInfo: {
      gender: Array<{ count: number, name: string }>,
      roles: Array<{ count: number, name: string }>,
    },
    users: Array<User>,
  }
}

export const getUsers = createAsyncThunk<AdminUserResponse, void>(
  'admin-user/getUsers',
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(
        backendRoutes.admin.users.get,
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const getUser = createAsyncThunk<User, string>(
  'admin-user/getUser',
  async (userId, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(
        backendRoutes.admin.users.getById(userId),
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const deleteUser = createAsyncThunk<void, string>(
  'admin-user/deleteUser',
  async (userId, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.delete(
        backendRoutes.admin.users.delete(userId),
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const { clearUser, clearUsers } = adminUserSlice.actions;
export default adminUserSlice.reducer;