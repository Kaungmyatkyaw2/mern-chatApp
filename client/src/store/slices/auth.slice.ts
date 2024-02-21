import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User } from "../../types/user.types";

interface initialState {
  access_token: undefined | null | string;
  user: User | undefined | null;
}

const initalValue: initialState = { access_token: null, user: null };

const AuthSlice = createSlice({
  name: "auth",
  initialState: initalValue,
  reducers: {
    setAuth(state, action) {
      const { access_token, user } = action.payload;
      state.access_token = access_token;
      state.user = user;
    },
    logOut(state) {
      state.access_token = null;
      state.user = null;
    },
  },
});

export const { setAuth,logOut } = AuthSlice.actions;
export const getAccessToken = (state: RootState) => state.auth.access_token;
export const getUser = (state: RootState) => state.auth.user;
export default AuthSlice.reducer;
