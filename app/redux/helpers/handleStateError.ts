import { PayloadAction } from "@reduxjs/toolkit";

function readMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.message === "string" && record.message.trim()) {
    return record.message.trim();
  }
  if (typeof record.error === "string" && record.error.trim()) {
    return record.error.trim();
  }
  if (record.error && typeof record.error === "object") {
    return readMessage(record.error);
  }
  return null;
}

function handleStateError<T extends { error: { message: string | null } }>(
  state: T,
  action: PayloadAction<unknown>
) {
  let error =
    readMessage(action.payload) || "Something went wrong. Please try again.";

  if (error === "Network Error") {
    error =
      "Couldn't connect. Please check your internet connection or try again later.";
  }
  if (/access token is required/i.test(error) || /^unauthorized$/i.test(error)) {
    error = "Couldn't load this data. Please refresh or sign in again.";
  }

  state.error.message = error;
}

export default handleStateError;
