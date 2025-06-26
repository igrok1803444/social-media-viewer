export interface IChat {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  username: string;
}

export interface IMessage {
  id: string;
  from_user: { first_name: string | null; last_name: string | null };
  text: string;
  sender_chat: {
    title: string | null;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
  };
}

export interface ITelegramState {
  isConnected: boolean;
  chats: IChat[];
  messages: IMessage[];
  loading: boolean;
  phoneCodeHash: string;
  isConfirmCode: boolean;
}

export interface IConnect {
  session_name?: string;
  phone_number: string;
}

export interface IConfirmCode {
  session_name?: string;
  phone_number: string;
  phone_code: string;
  phone_code_hash: string;
}

export interface IConfirm2FA {
  session_name?: string;
  password: string;
}

export interface ISessionName {
  session_name?: string;
}
