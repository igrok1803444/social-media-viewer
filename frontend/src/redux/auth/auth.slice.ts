import { createSlice } from "@reduxjs/toolkit";
import { login, logout, refresh, register } from "./auth.operations";
import { IUserSate } from "../../types/auth";

const initialState: IUserSate = {
  access_token: "",
  refresh_token: "",
  user: {
    username: "",
    email: "",
    _id: "",
  },
  isLoggedIn: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = payload.user;
        state.access_token = payload.access_token;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = payload.user;
        state.access_token = payload.access_token;
      })
      .addCase(refresh.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refresh.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(refresh.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = payload.user;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, () => {
        return initialState;
      });
  },
});
export const authSliceReducer = authSlice.reducer;
