import { createSlice } from "@reduxjs/toolkit";
import { ITelegramState } from "../../types/telegram";
import {
  telegramConfirmCode,
  telegramConnect,
  telegramDisconnect,
  telegramGetChatMessages,
  telegramGetChats,
} from "./telegram.operations";

const initialState: ITelegramState = {
  isConnected: false,
  chats: [],
  messages: [],
  phoneCodeHash: "",
  loading: false,
  isConfirmCode: false,
};

const telegramSlice = createSlice({
  name: "telegram",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(telegramConnect.pending, (state) => {
        state.loading = true;
      })
      .addCase(telegramConnect.rejected, (state) => {
        state.loading = false;
      })
      .addCase(telegramConnect.fulfilled, (state, action) => {
        state.loading = false;
        state.isConfirmCode = true;
        state.phoneCodeHash = action.payload.session_connect.phone_code_hash;
      })
      .addCase(telegramConfirmCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(telegramConfirmCode.rejected, (state) => {
        state.loading = false;
      })
      .addCase(telegramConfirmCode.fulfilled, (state) => {
        state.loading = false;
        state.isConnected = true;
      })
      .addCase(telegramGetChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(telegramGetChats.rejected, (state) => {
        state.loading = false;
      })
      .addCase(telegramGetChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.chats;
      })
      .addCase(telegramGetChatMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(telegramGetChatMessages.rejected, (state) => {
        state.loading = false;
      })
      .addCase(telegramGetChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(telegramDisconnect.pending, (state) => {
        state.loading = true;
      })
      .addCase(telegramDisconnect.rejected, (state) => {
        state.loading = false;
        state.isConnected = false;
      })
      .addCase(telegramDisconnect.fulfilled, (state) => {
        state.loading = false;
        state.isConnected = false;
        state.messages = [];
        state.chats = [];
      });
  },
});
export const telegramSliceReducer = telegramSlice.reducer;
