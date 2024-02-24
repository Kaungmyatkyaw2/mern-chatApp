import { Message } from "../../../../types/message.types";
import { QueryResponse } from "../../../../types/queryResponse.types";
import { ApiSlice } from "../api.slice";

const MessageEndpoints = ApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation<QueryResponse<Message>, any>({
      query: (body) => ({
        url: "messages",
        method: "POST",
        body,
      }),
    }),
    getMessages: builder.query<
      QueryResponse<Message[]>,
      { id: string; page: number }
    >({
      query: ({ id, page }) =>
        `conversations/${id}/messages?limit=10&page=${page}`,
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return endpointName + queryArgs.id;
      },
      merge: (currentCache, newItems) => {
        currentCache.data.unshift(...newItems.data);
        currentCache.results = newItems.results;
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.id !== previousArg?.id ||
          currentArg?.page !== previousArg?.page
        );
      },
    }),
  }),
});

export const addNewMessage = (newMsg: Message, conversationId: string) =>
  MessageEndpoints.util.updateQueryData(
    "getMessages",
    { id: conversationId, page: 0 },
    (draft) => {
      draft.data = [
        ...draft.data.filter((msg) => msg._id !== newMsg._id),
        newMsg,
      ];
    }
  );

export const { useCreateMessageMutation, useGetMessagesQuery } =
  MessageEndpoints;
