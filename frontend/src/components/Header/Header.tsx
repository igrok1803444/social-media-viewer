import { FC } from "react";

import styles from "./Header.module.css";
import Navigation from "../Navigation/Navigation";
import AuthNavigation from "../AuthNavigation/AuthNavigation";

const Header: FC = () => {
  return (
    <header className={styles.header}>
      <Navigation />
      <AuthNavigation />
    </header>
  );
};
export default Header;
