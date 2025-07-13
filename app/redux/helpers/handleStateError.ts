import { PayloadAction } from "@reduxjs/toolkit";

function handleStateError<T extends { error: { message: string | null } }>(
  state: T,
  action: PayloadAction<{ message: string; error?: string }>
) {
  if (action.payload) {
    let error = action.payload.error || action.payload.message;
    if (error === "Network Error") {
      error =
        "Couldn't connect. Please check your internet connection or try again later.";
    }
    state.error.message = error;
  } else {
    state.error.message = "Something went wrong. Please try again.";
  }
}

export default handleStateError;
