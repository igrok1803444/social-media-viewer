import { SubmitHandler, useForm } from "react-hook-form";
import { IFormDataRegister } from "../../types/auth";
import { RegisterSchema } from "../../config/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register as RegisterUser } from "../../redux/auth/auth.operations";
import styles from "./Register.module.css";
import { AppDispatch } from "../../redux/store";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormDataRegister>({
    resolver: yupResolver(RegisterSchema),
  });

  const onFormSubmit: SubmitHandler<IFormDataRegister> = async (data) => {
    try {
      const loginData = data as IFormDataRegister;

      dispatch(RegisterUser(loginData));
      navigate("/chats");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className={styles.auth_container}>
        <div className={styles.inputs_wrap}>
          <div>
            <label className={styles.input_wrap}>
              <input
                className={styles.input_field}
                type="text"
                autoComplete="on"
                placeholder="USERNAME"
                {...register("username", {
                  required: "Enter your username",
                })}
              />
            </label>
            {errors.username && (
              <p className={styles.error_message}>{errors.username.message}</p>
            )}
          </div>
          <div>
            <label className={styles.input_wrap}>
              <input
                className={styles.input_field}
                type="email"
                autoComplete="on"
                placeholder="EMAIL"
                {...register("email", {
                  required: "Enter your email",
                })}
              />
            </label>
            {errors.email && (
              <p className={styles.error_message}>{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className={styles.input_wrap}>
              <input
                className={styles.input_field}
                type="password"
                placeholder="PASSWORD"
                autoComplete="off"
                {...register("password", {
                  required: "Enter your password",
                })}
              />
            </label>
            {errors.password && (
              <p className={styles.error_message}>{errors.password.message}</p>
            )}
          </div>
        </div>
        <button type="submit" className={styles.button_send_form}>
          REGISTER
        </button>
        <div className={styles.forgot_account_wrap}>
          <button
            className={styles.auxiliary_button}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            If you have an account?
          </button>
        </div>
      </div>
    </form>
  );
};
export default Login;
