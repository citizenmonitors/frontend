import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 } from "uuid";

type InitialAlertState = {
  id: string | null;
  message: string | null;
  type: 'info' | 'success' | 'error' | 'warning';
}

const initialState: InitialAlertState = {
  id: null,
  message: null,
  type: 'info'
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<{ message: string, type: InitialAlertState['type'] }>) => {
      const alertID = v4();
      const { message, type } = action.payload;
      state.id = alertID;
      state.message = message;
      state.type = type;
    },
    clearAlert: (state) => {
      state.id = null;
      state.message = null;
      state.type = 'info';
    }
  }
})

export const { showAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;