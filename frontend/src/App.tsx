import React, { FC, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layot from "./components/Layot/Layot";
import { PublicRoute } from "./routes/PublicRoute";
import { PrivateRoute } from "./routes/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn } from "./redux/auth/auth.selectors";
import { AppDispatch } from "./redux/store";
import { refresh } from "./redux/auth/auth.operations";

const HomePage = React.lazy(() => import("./pages/Home/Home"));
const LoginPage = React.lazy(() => import("./pages/Login/Login"));
const RegisterPage = React.lazy(() => import("./pages/Register/Register"));
const ChatsPage = React.lazy(() => import("./pages/Chats/Chats"));
const MessageList = React.lazy(
  () => import("./components/MessageList/MessageList")
);

const App: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  useEffect(() => {
    if (!isLoggedIn) dispatch(refresh());
  }, [dispatch, isLoggedIn]);
  return (
    <Routes>
      <Route path="/" element={<Layot />}>
        <Route index element={<HomePage />} />
        <Route
          path="/register"
          element={
            <PublicRoute redirectTo="/chats" component={<RegisterPage />} />
          }
        />
        <Route
          path="login"
          element={
            <PublicRoute redirectTo="/chats" component={<LoginPage />} />
          }
        />
        <Route
          path="/chats"
          element={<PrivateRoute component={<ChatsPage />} />}
        >
          <Route
            path=":id"
            element={<PrivateRoute component={<MessageList />} />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
