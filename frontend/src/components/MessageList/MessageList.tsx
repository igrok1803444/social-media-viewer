import { useDispatch, useSelector } from "react-redux";
import { IMessage } from "../../types/telegram";
import { selectMessages } from "../../redux/telegram/telegram.selectors";
import style from "./MessagesList.module.css";
import { useParams } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import { useEffect } from "react";
import { telegramGetChatMessages } from "../../redux/telegram/telegram.operations";

const MessageList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const messages = useSelector(selectMessages);

  useEffect(() => {
    if (id) {
      dispatch(telegramGetChatMessages(id));
    }
  }, [dispatch, id]);

  return (
    <ul className={style.list}>
      {messages.length > 0 &&
        messages.map((message: IMessage) => (
          <li key={message.id} className={style.li}>
            <h3>
              From:
              {message.from_user.first_name ||
                message.from_user.last_name ||
                message.sender_chat.first_name ||
                message.sender_chat.last_name ||
                message.sender_chat.title ||
                message.sender_chat.username}
            </h3>
            <h3>Message: {message.text}</h3>
          </li>
        ))}
    </ul>
  );
};
export default MessageList;
