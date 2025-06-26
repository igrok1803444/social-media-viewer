import { RootState } from "../store";

export const selectConnectionStaus = (state: RootState) =>
  state.telegram.isConnected;
export const selecChats = (state: RootState) => state.telegram.chats;
export const selectMessages = (state: RootState) => state.telegram.messages;
export const selectLoading = (state: RootState) => state.telegram.loading;
export const selectPhoneCodeHash = (state: RootState) =>
  state.telegram.phoneCodeHash;
export const selectIsConfirmCode = (state: RootState) =>
  state.telegram.isConfirmCode;
