import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth.slice";
import { ApiSlice } from "./slices/api/api.slice";
import conversationSlice from "./slices/conversation.slice";

const reducers = {
  [ApiSlice.reducerPath]: ApiSlice.reducer,
  auth: authSlice,
  conversation: conversationSlice,
};

const combinedReducer = combineReducers<typeof reducers>(reducers);

export const store = configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ApiSlice.middleware),
});

export type RootState = ReturnType<typeof combinedReducer>;
export type AppDispatch = typeof store.dispatch;
