import { configureStore } from "@reduxjs/toolkit";
import { authSliceReducer } from "./auth/auth.slice";
import { telegramSliceReducer } from "./telegram/telegram.slice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    telegram: telegramSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: [
          "payload.headers",
          "payload.config",
          "payload.request",
          "payload.config.transformRequest",
          "payload.config.transformResponse",
        ],
        ignoredPaths: ["auth.token", "auth.user"],
      },
    }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
