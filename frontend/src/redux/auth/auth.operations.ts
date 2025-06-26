import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../config/axios/axios";
import { IError } from "../../types/error";
import { IUserLogin, IUserRegister } from "../../types/auth";

const setAuthHeader = (token: string) => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  instance.defaults.headers.common.Authorization = "";
};

export const register = createAsyncThunk(
  "users/register",
  async (data: IUserRegister, { rejectWithValue }) => {
    try {
      const response = await instance.post("users/register", data);
      localStorage.setItem("tokenTelegram", response.data.access_token);
      setAuthHeader(response.data.access_token);
      return response.data;
    } catch (error) {
      const typedError = error as IError;
      if (typedError.message) {
        return rejectWithValue(typedError.message);
      } else {
        return rejectWithValue(
          "An unknown error occurred during registration."
        );
      }
    }
  }
);
export const login = createAsyncThunk(
  "users/login",
  async (data: IUserLogin, { rejectWithValue }) => {
    try {
      const response = await instance.post("users/login", data);
      localStorage.setItem("tokenTelegram", response.data.access_token);
      setAuthHeader(response.data.access_token);
      return response.data;
    } catch (error) {
      const typedError = error as IError;
      if (typedError.message) {
        return rejectWithValue(typedError.message);
      } else {
        return rejectWithValue("An unknown error occurred during login.");
      }
    }
  }
);
export const refresh = createAsyncThunk(
  "users/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("tokenTelegram");
      if (!token) {
        return rejectWithValue("No token found. Please log in.");
      }
      setAuthHeader(token);
      const response = await instance.post("users/refresh");
      return response.data;
    } catch (error) {
      const typedError = error as IError;
      if (typedError.message) {
        return rejectWithValue(typedError.message);
      } else {
        return rejectWithValue("An unknown error occurred during refreshing.");
      }
    }
  }
);
export const logout = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.post("users/logout");
      clearAuthHeader();
      return response.data;
    } catch (error) {
      const typedError = error as IError;
      if (typedError.message) {
        return rejectWithValue(typedError.message);
      } else {
        return rejectWithValue("An unknown error occurred during logout.");
      }
    }
  }
);
