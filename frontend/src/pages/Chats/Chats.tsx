import ChatList from "../../components/ChatList/ChatList";
import style from "./Chats.module.css";
import ConnectWithCode from "../../components/ConnectWithCode/ConnectWithCode";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const Chats = () => {
  const isConnected = localStorage.getItem("telegram");

  return (
    <div className={style.chat_wrap}>
      <div className={style.chat_list_wrap}>
        {isConnected === "success" && <ChatList />}
      </div>
      ;
      <div className={style.info_wrap}>
        {isConnected !== "success" && <ConnectWithCode />}
        {isConnected === "success" && (
          <Suspense>
            <Outlet />
          </Suspense>
        )}
      </div>
    </div>
  );
};
export default Chats;
