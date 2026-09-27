type FetchInThunkParams = {
  asyncCallback: () => Promise<{ data: any }>;
  rejectWithValue: (value: unknown) => any;
};

function toErrorPayload(error: any) {
  const data = error?.response?.data;
  const status = error?.response?.status;

  if (typeof data === "string" && data.trim()) {
    return { message: data.trim() };
  }

  if (data && typeof data === "object") {
    const nested = data.error;
    const message =
      (typeof data.message === "string" && data.message) ||
      (typeof nested === "string" && nested) ||
      (nested &&
        typeof nested === "object" &&
        typeof nested.message === "string" &&
        nested.message) ||
      (status === 401
        ? "Couldn't load this data. Please refresh or sign in again."
        : "Something went wrong. Please try again.");
    return { message };
  }

  if (error?.message === "Network Error") {
    return {
      message:
        "Couldn't connect. Please check your internet connection or try again later.",
    };
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return { message: error.message };
  }

  return { message: "Something went wrong. Please try again." };
}

async function fetchInThunk({ asyncCallback, rejectWithValue }: FetchInThunkParams) {
  try {
    const { data } = await asyncCallback();
    return data;
  } catch (error: any) {
    return rejectWithValue(toErrorPayload(error));
  }
}

export default fetchInThunk;
