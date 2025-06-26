import { useDispatch, useSelector } from "react-redux";

import { selectIsLoggedIn } from "../../redux/auth/auth.selectors";
import style from "./AuthNavigation.module.css";
import NavigationLink from "../Navlink/NavigationLink";
import { logout } from "../../redux/auth/auth.operations";
import { AppDispatch } from "../../redux/store";
import { selectConnectionStaus } from "../../redux/telegram/telegram.selectors";
import { telegramDisconnect } from "../../redux/telegram/telegram.operations";
import { useNavigate } from "react-router-dom";

const AuthNavigation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isConnect = useSelector(selectConnectionStaus);
  const isConnectLocalStorage = localStorage.getItem("telegram");

  const connect = isConnect || isConnectLocalStorage === "success";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleDisconnect = () => {
    dispatch(telegramDisconnect({}));
    navigate("/login");
  };

  return (
    <nav className={style.nav}>
      {isLoggedIn ? (
        <>
          {connect && (
            <button
              className={style.logout_btn}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleDisconnect();
              }}
            >
              Disconnect Telegram
            </button>
          )}
          <button
            className={style.logout_btn}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <NavigationLink to="register" text="Register" />
          <NavigationLink to="login" text="Login" />
        </>
      )}
    </nav>
  );
};
export default AuthNavigation;
