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
    googleAuth: builder.mutation<LoginReturnType, any>({
      query: (body) => ({
        url: "users/google",
        method: "POST",
        body,
      }),
    }),
    getMe: builder.query<QueryResponse<User>, void>({
      query: () => "users/me",
      keepUnusedDataFor: 0,
    }),
    updateMe: builder.mutation<
      QueryResponse<User>,
      { name: string; picture: string }
    >({
      query: (body) => ({
        url: "users/me",
        method: "PATCH",
        body,
      }),
    }),
    updateMyPassword: builder.mutation<
      LoginReturnType,
      {
        password: string;
        passwordConfirm: string;
        oldPassword: string;
      }
    >({
      query: (body) => ({
        url: "users/updateMyPassword",
        method: "PATCH",
        body,
      }),
    }),
    logout: builder.mutation<LoginReturnType, void>({
      query: () => ({
        url: "users/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetMeQuery,
  useLogoutMutation,
  useGoogleAuthMutation,
  useUpdateMeMutation,
  useUpdateMyPasswordMutation,
} = endpoints;
