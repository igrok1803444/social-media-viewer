import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { NavigateFunction } from "react-router-dom";

export interface IUserSate {
  access_token: string;
  refresh_token: string;
  user: {
    username: string;
    email: string;
    _id: string;
  };
  isLoggedIn: boolean;
  isLoading: boolean;
}
export interface IUser {
  username: string;
  email: string;
  _id: string;
}
export interface IUserLogin {
  email: string;
  password: string;
}
export interface IUserRegister {
  username: string;
  email: string;
  password: string;
}
export interface IFormData extends FieldValues {
  email: string;
  password: string;
}

export interface IFormDataRegister extends IFormData {
  username: string;
}

export interface IPropsLogin<TFieldValues extends IFormData = IFormData> {
  navigate: NavigateFunction;
  register: UseFormRegister<IFormData>;
  errors: FieldErrors<TFieldValues>;
}
export interface IPropsRegister<
  TFieldValues extends IFormDataRegister = IFormDataRegister
> {
  register: UseFormRegister<IFormDataRegister | IFormData>;
  navigate: NavigateFunction;
  errors: FieldErrors<TFieldValues>;
}
