import { BaseQueryFn, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { RootState } from "./../../store";
import { logOut, setAuth } from "../auth.slice";
import { LoginReturnType } from "../../../types/queryResponse.types";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/",
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState)?.auth?.access_token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
  },
});

const baseQueryWithReAuth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery("/users/refresh", api, extraOptions);
    if (refreshResult?.data) {
      api.dispatch(
        setAuth({
          access_token: (refreshResult.data as LoginReturnType).token,
          user: (refreshResult.data as LoginReturnType).data,
        })
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const ApiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  tagTypes : ["Conversations"],
  endpoints: (_) => ({}),
});
