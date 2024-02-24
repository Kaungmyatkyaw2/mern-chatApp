import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Conversation } from "../../types/conversations.types";

interface initialState {
  conversations: Conversation[];
}

const initalValue: initialState = { conversations: [] };

const ConversationSlice = createSlice({
  name: "conversation",
  initialState: initalValue,
  reducers: {
    setConversation(state, action) {
      state.conversations = action.payload;
    },
  },
});

export const { setConversation } = ConversationSlice.actions;
export const getConversations = (state: RootState) => state.conversation.conversations;
export default ConversationSlice.reducer;
