import { QueryResponse } from "../../../../types/queryResponse.types";
import { User } from "../../../../types/user.types";
import { ApiSlice } from "../api.slice";

const UserEndpoints = ApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<QueryResponse<User[]>, string>({
      query: (email) => `users/search?email=${email}`,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const { useGetUsersQuery } = UserEndpoints;
