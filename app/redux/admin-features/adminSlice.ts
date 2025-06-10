import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AdminAdminGraphs, AdminPermissions, FetchState, User, UserRole } from "../types"
import fetchInThunk from "../helpers/fetchInThunk";
import { backendRoutes } from "@/app/data/backend";
import backendAxiosConfig from "@/app/data/axiosConfig";
import axios from "axios";
import handleStateError from "../helpers/handleStateError";

export type AdminCardAdmin = Pick<User, '_id' | 'email' | 'firstName' | 'lastName' | 'profileImage' | 'role'>;

type InitialAdminState = {
  graphs: AdminAdminGraphs,
  admins: Array<AdminCardAdmin>;
  admin: {
    details: AdminCardAdmin | null,
    config: {
      role: UserRole,
      permissions: Record<AdminPermissions, boolean>,
    } | null,
  },
  status: {
    fetchAdmins: FetchState,
    suspendAdmin: FetchState,
    createAdmin: FetchState,
    updateAdmin: FetchState,
    fetchAdmin: FetchState,
  },
  error: {
    message: string | null,
  }
};

const initialState: InitialAdminState = {
  graphs: {
    logs: {
      count: 0,
      data: [0, 0, 0, 0, 0, 0, 0],
      lastMonthComparison: 0
    },
    admins: [],
  },
  admin: {
    details: null,
    config: null
  },
  admins: [],
  status: {
    fetchAdmins: 'not started',
    suspendAdmin: 'not started',
    createAdmin: 'not started',
    updateAdmin: 'not started',
    fetchAdmin: 'not started',
  },
  error: {
    message: null,
  }
};

const adminAdminSlice = createSlice({
  name: 'admin-admin',
  initialState,
  reducers: {
    clearAdminState(state) {
      state.graphs = initialState.graphs;
      state.admins = initialState.admins;
      state.status = initialState.status;
    },
    clearAdmin(state) {
      state.admin = initialState.admin;
      state.status.fetchAdmin = initialState.status.fetchAdmin;
      state.status.updateAdmin = initialState.status.updateAdmin;
    }
  },
  extraReducers: (builder) => {
    // Fetch Admin Data
    builder.addCase(getAdmins.pending, (state) => {
      state.status.fetchAdmins = 'pending'
    });
    builder.addCase(getAdmins.fulfilled, (state, action) => {
      function formatCountToNumber(com: string) {
        return Number(com.slice(0, -1));
      }

      state.graphs = {
        logs: {
          count: action.payload.totalLogs,
          data: action.payload.logs,
          lastMonthComparison: formatCountToNumber(action.payload.statsPercentage),
        },
        admins: action.payload.admins,
      }
      state.admins = action.payload.admins.map(admin => ({
        ...admin,
        role: admin.role || 'admin'
      }));
      state.status.fetchAdmins = 'fulfilled';
    });
    builder.addCase(getAdmins.rejected, (state, action: any) => {
      state.status.fetchAdmins = 'rejected';
      handleStateError(state, action);
    });

    // Suspend Admin
    builder.addCase(suspendAdmin.pending, (state) => {
      state.status.suspendAdmin = 'pending'
    });
    builder.addCase(suspendAdmin.fulfilled, (state) => {
      state.status.suspendAdmin = 'fulfilled';
    });
    builder.addCase(suspendAdmin.rejected, (state, action: any) => {
      state.status.suspendAdmin = 'rejected';
      handleStateError(state, action);
    });

    // Create Admin
    builder.addCase(createAdmin.pending, (state) => {
      state.status.createAdmin = 'pending'
    });
    builder.addCase(createAdmin.fulfilled, (state) => {
      state.status.createAdmin = 'fulfilled';
    });
    builder.addCase(createAdmin.rejected, (state, action: any) => {
      state.status.createAdmin = 'rejected';
      handleStateError(state, action);
    });

    // Get Admin By Id
    builder.addCase(getAdminById.pending, (state) => {
      state.status.fetchAdmin = 'pending'
    });
    builder.addCase(getAdminById.fulfilled, (state, action) => {
      state.admin.config = action.payload;
      state.status.fetchAdmin = 'fulfilled';
    });
    builder.addCase(getAdminById.rejected, (state, action: any) => {
      state.status.fetchAdmin = 'rejected';
      handleStateError(state, action);
    });

    // Update Admin
    builder.addCase(updateAdmin.pending, (state) => {
      state.status.updateAdmin = 'pending'
    });
    builder.addCase(updateAdmin.fulfilled, (state) => {
      state.status.updateAdmin = 'fulfilled';
    });
    builder.addCase(updateAdmin.rejected, (state, action: any) => {
      state.status.updateAdmin = 'rejected';
      handleStateError(state, action);
    });
  }
});

type AdminDataResponse = {
  admins: AdminCardAdmin[];
  totalLogs: number,
  logs: Array<number>,
  statsPercentage: string,
};
export const getAdmins = createAsyncThunk<AdminDataResponse, void>(
  'admin-admin/fetchAdmins',
  async (_, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(
        backendRoutes.admin.admins.get,
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const suspendAdmin = createAsyncThunk<void, string>(
  'admin-admin/suspendAdmin',
  async (adminId, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.patch(
        backendRoutes.admin.admins.suspend(adminId),
        {},
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

export const createAdmin = createAsyncThunk<void, { email: string, role: UserRole, permissions: Record<AdminPermissions, boolean> }>(
  'admin-admin/createAdmin',
  async ({ email, role, permissions }, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.post(
        backendRoutes.admin.admins.create,
        { email, role, permissions },
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

type AdminConfigResponse = {
  role: UserRole,
  permissions: Record<AdminPermissions, boolean>,
}
export const getAdminById = createAsyncThunk<AdminConfigResponse, AdminCardAdmin>(
  'admin-admin/getAdminById',
  async (admin, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.get(
        backendRoutes.admin.admins.getById(admin._id),
        backendAxiosConfig()
      ),
      rejectWithValue
    })
  }
);

type UpdateAdminConfig = {
  adminId: string
  role: UserRole,
  permissions: Record<AdminPermissions, boolean>,
}
export const updateAdmin = createAsyncThunk<void, UpdateAdminConfig>(
  'admin-admin/updateAdmin',
  async ({ adminId, role, permissions }, { rejectWithValue }) => {
    return await fetchInThunk({
      asyncCallback: () => axios.put(
        backendRoutes.admin.admins.update(adminId),
        {
          role,
          permissions,
        },
        backendAxiosConfig()
      ),
      rejectWithValue
    });
  }
);

export const { clearAdminState, clearAdmin } = adminAdminSlice.actions;
export default adminAdminSlice.reducer;