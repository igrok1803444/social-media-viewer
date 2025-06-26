import { createAsyncThunk } from "@reduxjs/toolkit";
import { IConfirmCode, IConnect, ISessionName } from "../../types/telegram";
import { IError } from "../../types/error";
import { instance } from "../../config/axios/axios";

export const telegramConnect = createAsyncThunk(
  "telegram/connect",
  async (data: IConnect, { rejectWithValue }) => {
    try {
      const response = await instance.post("telegram/connect", data);
      return response.data;
    } catch (error) {
      const typedError = error as IError;
      if (typedError.message) {
        return rejectWithValue(typedError.message);
      } else {
        return rejectWithValue(
          "An unknown error occurred during telegram connect."
        );
      }
    }
  }
);
export const telegramConfirmCode = createAsyncThunk(
  "telegram/verify-code",
  async (data: IConfirmCode, { rejectWithValue }) => {
    try {
      const response = await instance.post("telegram/verify-code", data);
      localStorage.setItem("telegram", "success");
      return response.data;
    } catch (error) {
      const typedError = error as IError;
      if (typedError.message) {
        return rejectWithValue(typedError.message);
      } else {
        return rejectWithValue(
          "An unknown error occurred during telegram confirmation code."
        );
      }
    }
  }
);

export const telegramGetChats = createAsyncThunk(
  "telegram/chats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("telegram/chats");
      return response.data;
    } catch (error) {
      const typedError = error as IError;
      if (typedError.message) {
        return rejectWithValue(typedError.message);
      } else {
        return rejectWithValue(
          "An unknown error occurred during get telegram chats."
        );
      }
    }
  }
);
export const telegramGetChatMessages = createAsyncThunk(
  "telegram/chat-messages",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await instance.get(`telegram/messages/${id}`);
      return response.data;
    } catch (error) {
      const typedError = error as IError;
      if (typedError.message) {
        return rejectWithValue(typedError.message);
      } else {
        return rejectWithValue(
          "An unknown error occurred during get telegram chat messages."
        );
      }
    }
  }
);
export const telegramDisconnect = createAsyncThunk(
  "telegram/disconnect",
  async (data: ISessionName, { rejectWithValue }) => {
    try {
      const response = await instance.post("telegram/disconnect", data);
      localStorage.setItem("telegram", "");

      return response.data;
    } catch (error) {
      const typedError = error as IError;
      if (typedError.message) {
        return rejectWithValue(typedError.message);
      } else {
        return rejectWithValue(
          "An unknown error occurred during telegram disconnect."
        );
      }
    }
  }
);
