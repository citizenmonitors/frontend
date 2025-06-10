import { AxiosResponse } from "axios";

type FetchInThunkParams = {
  asyncCallback: () => Promise<AxiosResponse<any, any>>;
  rejectWithValue: (value: unknown) => any;
}

async function fetchInThunk({ asyncCallback, rejectWithValue }: FetchInThunkParams) {
  try {
    const { data } = await asyncCallback();
    return data;
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue(error);
    }
  }
}

export default fetchInThunk;