import axios from "axios";

export const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
