import { Navigate, useLocation } from "react-router-dom";

import React, { ReactElement } from "react";
import { selectIsLoggedIn } from "../redux/auth/auth.selectors";
import { useSelector } from "react-redux";

interface PropTypes {
  component: ReactElement;
}

export const PrivateRoute: React.FC<PropTypes> = ({ component: Component }) => {
  const location = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return !isLoggedIn ? (
    <Navigate to="/login" state={{ from: location }} />
  ) : (
    Component
  );
};
