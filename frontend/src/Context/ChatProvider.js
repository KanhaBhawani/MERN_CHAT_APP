import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

/*
Hooks - useContext, useState, useEffect
*/


const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [changeState, setChangeState] = useState(false);

  const history = useHistory();

  useEffect(() => {

    // problem
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    setUser(userInfo);

    if (!userInfo){ 
        history.push("/")
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeState]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        changeState,
        setChangeState,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;