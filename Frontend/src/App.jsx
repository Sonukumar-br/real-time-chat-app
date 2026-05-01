import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useSelector, useDispatch } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { useEffect } from "react";
import { store } from "./redux/store";
import { setUserData, setOnlineUsers } from "./redux/userSlice";

import useGetCurrentUser from "./customHooks/getCurrentUser";
import useGetOtherUsers from "./customHooks/getOtherUser";

import { io } from "socket.io-client";
import { serverURL } from "./main";
import { setMessages } from "./redux/messageSlice";
function App() {
  let { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.message);

  useGetCurrentUser();
  useGetOtherUsers();

  // 🔹 Refresh fix
  useEffect(() => {
    const data = localStorage.getItem("userData");

    if (data && !userData) {
      dispatch(setUserData(JSON.parse(data)));
    }
  }, [dispatch, userData]);

  // 🔥 SOCKET FIX (NO REDUX)
  useEffect(() => {
    if (!userData?._id) return;

    const socket = io(`${serverURL}`, {
      query: {
        userId: userData._id,
      },
      withCredentials: true,
    });

    socket.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });
   socket.on("newMessage", (msg) => {
  const currentMessages = store.getState().message.messages;
  dispatch(setMessages([...currentMessages, msg]));
});

    return () => {
      socket.disconnect();
    };
  }, [userData, dispatch]);

  return (
    <Routes>
      <Route path="/login" element={!userData ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/profile" />} />
      <Route path="/" element={userData ? <Home /> : <Navigate to="/login" />} />
      <Route path="/profile" element={userData ? <Profile /> : <Navigate to="/signup" />} />
    </Routes>
  );
}

export default App;