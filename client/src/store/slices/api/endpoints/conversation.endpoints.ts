import { Conversation } from "../../../../types/conversations.types";
import { QueryResponse } from "../../../../types/queryResponse.types";
import { ApiSlice } from "../api.slice";

const endpoints = ApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<QueryResponse<Conversation[]>, void>({
      query: () => "conversations",
      providesTags: ["Conversations"],
    }),
    getConversation: builder.query<QueryResponse<Conversation>, string>({
      query: (id) => `conversations/${id}`,
    }),
    createConversation: builder.mutation<QueryResponse<Conversation>, any>({
      query: (body) => ({
        url: "conversations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Conversations"],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetConversationQuery,
} = endpoints;
