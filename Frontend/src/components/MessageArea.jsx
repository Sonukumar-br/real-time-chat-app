import axios from "axios";
import { serverURL } from "../main";
import React, { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import { FaRegImages } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import dp from "../assets/dp.png";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";

function MessageArea() {
  const { selectedUser, userData } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const image = useRef();

  // ✅ image handler
  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    if (file) {
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  // ✅ send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(input.length==0 && !backendImage){
      return 
    }

    try {
      const formData = new FormData();
      formData.append("message", input);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverURL}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      // ✅ safe update
      dispatch(setMessages([...messages, result.data]));

      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  return (
    <>
      {/* ✅ WELCOME SCREEN */}
      {!selectedUser && (
        <div className="hidden lg:flex flex-1 h-full justify-center items-center flex-col bg-slate-100">
          <h1 className="text-[35px] font-bold text-gray-600">
            Welcome to Chatly
          </h1>
          <p className="text-gray-500 mt-2">
            Select a user to start chatting...
          </p>
          <span className="text-red-500">developed by SONU</span>
        </div>
      )}

      {/* ✅ CHAT AREA */}
      <div
        className={`flex-1 relative ${
          selectedUser ? "flex lg:flex" : "hidden"
        } w-full h-full bg-slate-200 border-l-2 border-gray-300`}
      >
        {selectedUser && (
          <div className="w-full h-[100vh] flex flex-col">
            {/* header */}
            <div className="w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-lg flex items-center px-[20px] gap-[20px]">
              <div onClick={() => dispatch(setSelectedUser(null))}>
                <IoIosArrowRoundBack className="w-[40px] h-[40px] text-white cursor-pointer" />
              </div>

              <div className="w-[60px] h-[60px] rounded-full overflow-hidden bg-white flex justify-center items-center">
                <img
                  src={selectedUser?.image || dp}
                  className="h-full"
                  alt=""
                />
              </div>

              <h1 className="text-white text-[20px] font-semibold">
                {selectedUser?.username}
              </h1>
            </div>

            {/* messages */}
            <div className="w-full h-[70%] flex-1 flex flex-col overflow-auto py-[50px] px-[20px] gap-[20px] pb-[120px]">
              {showPicker && (
                <div className="absolute bottom-[120px] left-[20px]">
                  <EmojiPicker
                    width={250}
                    height={350}
                    className="shadow-lg z-[100]"
                    onEmojiClick={onEmojiClick}
                  />
                </div>
              )}

              {messages &&
                messages.map((mess) => (
                  <div
                    key={mess._id}
                    className={`w-full flex ${
                      mess.sender === userData?._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {mess.sender === userData?._id ? (
                      <SenderMessage
                        image={mess.image || null}
                        message={mess.message}
                      />
                    ) : (
                      <ReceiverMessage
                        image={mess.image || null}
                        message={mess.message}
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* input */}
        {selectedUser && (
          <div className="w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex justify-center items-center">
            {frontendImage && (
              <img
                src={frontendImage}
                className="w-[80px] absolute bottom-[100px] right-[20%] rounded-lg"
                alt=""
              />
            )}

            <form
              onSubmit={handleSendMessage}
              className="w-[95%] lg:w-[70%] h-[60px] bg-[#1797c2] rounded-full flex items-center gap-[20px] px-[20px]"
            >
              <div onClick={() => setShowPicker((prev) => !prev)}>
                <BsEmojiSmile className="text-white w-[25px] h-[25px] cursor-pointer" />
              </div>

              <input
                type="file"
                hidden
                ref={image}
                onChange={handleImage}
              />

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message"
                className="w-full bg-transparent outline-none text-white placeholder-white"
              />

              <div onClick={() => image.current.click()}>
                <FaRegImages className="text-white w-[25px] h-[25px] cursor-pointer" />
              </div>
              {input.length > 0 || frontendImage ? (
                <button type="submit">
                  <IoSend className="text-white w-[25px] h-[25px]" />
                </button>
              ) : null}
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default MessageArea;