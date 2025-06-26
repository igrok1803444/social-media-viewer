import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  selecChats,
  selectConnectionStaus,
} from "../../redux/telegram/telegram.selectors";
import { useEffect } from "react";
import { telegramGetChats } from "../../redux/telegram/telegram.operations";
import { IChat } from "../../types/telegram";
import { Link, useLocation } from "react-router-dom";
import style from "./ChatList.module.css";

const ChatList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chats = useSelector(selecChats);
  const location = useLocation();

  const isConnect = useSelector(selectConnectionStaus);
  const isConnectLocalStorage = localStorage.getItem("telegram");
  useEffect(() => {
    if (isConnect || isConnectLocalStorage) {
      dispatch(telegramGetChats());
    }
  }, [dispatch, isConnect, isConnectLocalStorage]);
  return (
    <ul className={style.list}>
      {chats.length > 0 &&
        chats.map((chat: IChat) => (
          <li key={chat.id} className={style.li}>
            <Link
              to={`/chats/${chat.id}`}
              state={{ from: location }}
              className={style.link}
            >
              <h3>
                {chat.title ||
                  chat.username ||
                  `${chat.first_name} ${
                    chat.last_name ? chat.last_name : ""
                  } ` ||
                  "Unknown"}
              </h3>
            </Link>
          </li>
        ))}
    </ul>
  );
};
export default ChatList;
