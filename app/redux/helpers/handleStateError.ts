import { PayloadAction } from "@reduxjs/toolkit";

function handleStateError<T extends { error: { message: string | null } }>(
  state: T, action: PayloadAction<{ message: string, error?: string }>
) {
  if (action.payload) {
    state.error.message = action.payload.error || action.payload.message;
  } else {
    state.error.message = 'Something went wrong. Please try again.';
  }
}

export default handleStateError;