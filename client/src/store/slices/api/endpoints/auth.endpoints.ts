import {
  LoginReturnType,
  QueryResponse,
} from "../../../../types/queryResponse.types";
import { User } from "../../../../types/user.types";
import { ApiSlice } from "../api.slice";

const endpoints = ApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginReturnType, any>({
      query: (body) => ({
        url: "users/login",
        method: "POST",
        body,
      }),
    }),
    signup: builder.mutation<LoginReturnType, any>({
      query: (body) => ({
        url: "users/signup",
        method: "POST",
        body,
      }),
    }),
    getMe: builder.query<QueryResponse<User>, void>({
      query: () => "users/getMe",
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useGetMeQuery } = endpoints;