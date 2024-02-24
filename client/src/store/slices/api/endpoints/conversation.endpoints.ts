import { Conversation } from "../../../../types/conversations.types";
import { Message } from "../../../../types/message.types";
import { QueryResponse } from "../../../../types/queryResponse.types";
import { ApiSlice } from "../api.slice";

const ConversationEndpoints = ApiSlice.injectEndpoints({
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

export const updateLastMsg = (lastMsg: Message, conversationId: string) =>
  ConversationEndpoints.util.updateQueryData(
    "getConversations",
    undefined,
    (draft) => {
      draft.data = draft.data.map((el) =>
        el._id == conversationId ? { ...el, lastMessage: lastMsg } : el
      );
    }
  );
export const addNewConversation = (conversation: Conversation) =>
  ConversationEndpoints.util.updateQueryData(
    "getConversations",
    undefined,
    (draft) => {
      draft.data = [
        ...draft.data.filter((el) => el._id !== conversation._id),
        conversation,
      ];
    }
  );

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetConversationQuery,
} = ConversationEndpoints;
