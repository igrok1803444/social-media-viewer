import { SubmitHandler, useForm } from "react-hook-form";
import { IFormData } from "../../types/auth";
import { LoginSchema } from "../../config/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/auth/auth.operations";
import styles from "./Login.module.css";
import { AppDispatch } from "../../redux/store";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: yupResolver(LoginSchema),
  });

  const onFormSubmit: SubmitHandler<IFormData> = async (data) => {
    try {
      const loginData = data as IFormData;

      dispatch(login(loginData));
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
                autoComplete="on"
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
          LOGIN
        </button>
        <div className={styles.forgot_password_wrap}>
          <div className={styles.auxiliary_button}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default Login;
