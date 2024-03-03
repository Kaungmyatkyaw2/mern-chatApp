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
    deleteConversation: builder.mutation<QueryResponse<null>, string>({
      query: (id) => ({
        url: `conversations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conversations"],
    }),
    createConversation: builder.mutation<QueryResponse<Conversation>, any>({
      query: (body) => ({
        url: "conversations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Conversations"],
    }),
    leaveConversation: builder.mutation<QueryResponse<Conversation>, string>({
      query: (convId) => ({
        url: `conversations/${convId}/members`,
        method: "DELETE",
      }),
    }),
    addMember: builder.mutation<
      QueryResponse<Conversation>,
      { convId: string; member: string }
    >({
      query: ({ convId, member }) => ({
        url: `conversations/${convId}/members`,
        body: { member },
        method: "POST",
      }),
    }),
    addAdmin: builder.mutation<
      QueryResponse<Conversation>,
      { convId: string; admin: string }
    >({
      query: ({ convId, admin }) => ({
        url: `conversations/${convId}/admins`,
        body: { admin },
        method: "POST",
      }),
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

export const updateConversation = (conversation: Conversation) =>
  ConversationEndpoints.util.updateQueryData(
    "getConversation",
    conversation._id,
    (draft) => {
      draft.data = conversation;
    }
  );

export const updateConversations = (conversation: Conversation) =>
  ConversationEndpoints.util.updateQueryData(
    "getConversations",
    undefined,
    (draft) => {
      draft.data = draft.data.map((el) =>
        el._id == conversation._id ? conversation : el
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

export const deleteConversation = (conversation: Conversation) =>
  ConversationEndpoints.util.updateQueryData(
    "getConversations",
    undefined,
    (draft) => {
      draft.data = draft.data.filter((el) => el._id !== conversation._id);
    }
  );

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetConversationQuery,
  useDeleteConversationMutation,
  useLeaveConversationMutation,
  useAddMemberMutation,
  useAddAdminMutation,
} = ConversationEndpoints;
