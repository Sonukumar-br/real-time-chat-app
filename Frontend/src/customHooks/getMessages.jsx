import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";

const getMessages = () => {
  const dispatch = useDispatch();

  const { userData,selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!selectedUser?._id) return;
    dispatch(setMessages([]));
    const fetchMessages = async () => {
      try {
        const result = await axios.get(
          `${serverURL}/api/message/get/${selectedUser._id}`,
          { withCredentials: true }
        );

        dispatch(setMessages(result.data));

      } catch (error) {
        console.log("ERROR:", error.response?.data || error.message);
      }
    };

    fetchMessages();
  }, [selectedUser,userData]);
};

export default getMessages;