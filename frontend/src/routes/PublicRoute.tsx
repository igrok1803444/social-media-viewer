import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../redux/auth/auth.selectors";
import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";

interface PropTypes {
  component: ReactElement;
  redirectTo: string;
}

export const PublicRoute: React.FC<PropTypes> = ({
  component: Component,
  redirectTo = "/",
}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return isLoggedIn ? <Navigate to={redirectTo} /> : Component;
};
