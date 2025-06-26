import { useState } from "react";
import style from "./ConnectWithCode.module.css";

import {
  selectIsConfirmCode,
  selectPhoneCodeHash,
} from "../../redux/telegram/telegram.selectors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  telegramConfirmCode,
  telegramConnect,
} from "../../redux/telegram/telegram.operations";
import { useNavigate } from "react-router-dom";

const ConnectWithCode = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isConfirmCode = useSelector(selectIsConfirmCode);
  const codeHash = useSelector(selectPhoneCodeHash);

  const [code, setCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const sendConnect = {
      phone_number: phoneNumber,
    };
    const sendConfirm = {
      phone_number: phoneNumber,
      phone_code_hash: codeHash,
      phone_code: code,
    };

    if (!isConfirmCode) {
      dispatch(telegramConnect(sendConnect));
    } else {
      dispatch(telegramConfirmCode(sendConfirm));
      navigate("chats");
    }
  };
  return (
    <div>
      <form className={style.form_wrap} onSubmit={handleConnect}>
        <label className={style.input_wrap}>
          <span>Phone Number:</span>
          <input
            type="text"
            value={phoneNumber}
            placeholder={phoneNumber ? phoneNumber : "Type the phone number"}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={style.input_field}
          />
        </label>
        {isConfirmCode && (
          <label className={style.input_wrap}>
            <span>Code:</span>
            <input
              type="text"
              placeholder="Type your telegram code"
              onChange={(e) => setCode(e.target.value)}
              className={style.input_field}
            />
          </label>
        )}
        <button type="submit" className={style.send_button}>
          Connect
        </button>
      </form>
    </div>
  );
};
export default ConnectWithCode;
