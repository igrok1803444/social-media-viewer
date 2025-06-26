import React from "react";
import { NavLink } from "react-router-dom";
import style from "./NavigationLink.module.css";

type PropTypes = {
  to: string;
  text: string;
};

const NavigationLink: React.FC<PropTypes> = ({ to, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? `${style.link} ${style.active}` : style.link
      }
    >
      {text}
    </NavLink>
  );
};
export default NavigationLink;
