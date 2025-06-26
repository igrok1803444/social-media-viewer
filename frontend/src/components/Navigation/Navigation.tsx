import { useSelector } from "react-redux";

import { selectIsLoggedIn } from "../../redux/auth/auth.selectors";
import style from "./Navigation.module.css";
import NavigationLink from "../Navlink/NavigationLink";

const Navigation = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <nav className={style.nav}>
      <NavigationLink to="/" text="Home" />

      {isLoggedIn && <NavigationLink to="/chats" text="Chats" />}
    </nav>
  );
};
export default Navigation;
