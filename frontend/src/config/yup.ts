import * as yup from "yup";

export interface ILoginFormValues {
  email: string;
  password: string;
}

export interface IRegisterFormValues {
  username: string;
  email: string;
  password: string;
}

const AppError: Record<string, string> = {
  Min_length_password: "Password must be at least 6 characters",
  Required_password: "Enter your password",
  Required_email: "Enter your email address",
  Required_firstName: "Enter your Name",
  Wrong_email: "Email is not correct",
  Wrong_password: "Your password must include different signs",
};

export default AppError;

const LoginSchema: yup.ObjectSchema<ILoginFormValues> = yup.object().shape({
  email: yup
    .string()
    .email("Email must be valid")
    .required(AppError.Required_email),
  password: yup
    .string()
    .min(6, AppError.Min_length_password)
    .required(AppError.Required_password),
});

const RegisterSchema: yup.ObjectSchema<IRegisterFormValues> = yup
  .object()
  .shape({
    username: yup.string().required(AppError.Required_firstName),
    email: yup
      .string()
      .email(AppError.Wrong_email)
      .required(AppError.Required_email),
    password: yup
      .string()
      .min(6, AppError.Min_length_password)
      .required(AppError.Required_password),
  });

export { LoginSchema, RegisterSchema };
