import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8000";

function App() {
  const [token, setToken] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async () => {
    const res = await axios.post(`${API}/login`, {
      username: "test",
      password: "password",
    });
    setToken(res.data.access_token);
    console.log(res);
  };

  const connectTelegram = async () => {
    await axios.post(
      `${API}/telegram/connect`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadChats();
  };

  const loadChats = async () => {
    const res = await axios.get(`${API}/telegram/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChats(res.data);
  };

  const loadMessages = async (id) => {
    setSelectedChat(id);
    const res = await axios.get(`${API}/telegram/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(res.data);
  };

  const logoutTelegram = async () => {
    await axios.post(
      `${API}/telegram/disconnect`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setChats([]);
    setMessages([]);
    setSelectedChat(null);
  };

  return (
    <div>
      <h1>Telegram Viewer</h1>
      {!token && <button onClick={login}>Login</button>}
      {token && <button onClick={connectTelegram}>Connect Telegram</button>}
      {token && chats.length > 0 && (
        <div>
          <h2>Chats</h2>
          <ul>
            {chats.map((chat) => (
              <li key={chat.id} onClick={() => loadMessages(chat.id)}>
                {chat.title ||
                  `${chat.first_name} ${(chat.last_name = null
                    ? chat.last_name
                    : "")}`}
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedChat && (
        <div>
          <h3>Messages in Chat {selectedChat}</h3>
          <ul>
            {messages.map((msg) => (
              <li key={msg.id}>{msg.text}</li>
            ))}
          </ul>
        </div>
      )}
      {token && <button onClick={logoutTelegram}>Disconnect Telegram</button>}
    </div>
  );
}

export default App;
