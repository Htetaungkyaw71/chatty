import { useEffect, useState } from "react";
import {
  useAddMessageMutation,
  useGetAllMessageQuery,
} from "../redux/messageServices";
import { loadState } from "../redux/localstorage";
import axios from "axios";
import Loader from "./helper/Loader";
import { VscSend } from "react-icons/vsc";
import { useRef } from "react";
import { BiSolidVideo } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

import Message from "./Message";

/* eslint-disable react/prop-types */
const Chatcontainer = ({
  currentChat,
  roomId,
  currentUser,
  setroomId,
  refetch,
}) => {
  const chatContainerRef = useRef(null);
  const [dot, setDot] = useState(false);

  const [text, setText] = useState("");
  const {
    data,
    isLoading,
    refetch: recall,
  } = useGetAllMessageQuery({ roomId });
  const [addMessage] = useAddMessageMutation();

  useEffect(() => {
    const lastMessage = chatContainerRef.current.querySelector(
      ".last-message > div:last-child",
    );
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const messages = data.data;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await addMessage({ text, roomId })
        .unwrap()
        .then((fulfilled) => {
          console.log(fulfilled);
          recall();
          setText("");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const removeContact = async (e) => {
    const user = loadState();
    e.preventDefault();
    try {
      const data = await axios.delete(
        `http://localhost:5000/api/contact/${currentChat.id}`,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        },
      );
      refetch();
      setroomId(false);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {dot && (
        <div className="z-10 absolute right-64 bg-white text-black p-3 top-14 rounded-xl rounded-bl-none">
          <button onClick={removeContact}>Remove contact</button>
        </div>
      )}
      {currentChat && (
        <div className="flex flex-col h-[80vh] ">
          <div className="flex justify-between items-center border-b-[1px] p-2 border-gray-700 mb-3 ">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={`data:image/svg+xml;base64,${currentChat.otherUserAvater}`}
                className="rounded-xl w-10 h-10"
              />
              {currentChat.otherUserName}
            </div>
            <div className="flex items-center gap-4">
              <button>
                <BiSolidVideo className="text-2xl" />
              </button>
              <button onClick={() => setDot(!dot)}>
                <BsThreeDotsVertical className="text-xl" />
              </button>
            </div>
          </div>

          <div
            className="flex-1 chat-scroll last-message p-3 text-gray-100"
            ref={chatContainerRef}
          >
            {messages.map((message) => (
              <div key={message.id}>
                <Message
                  message={message}
                  currentUser={currentUser}
                  recall={recall}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-3 w-full mx-auto px-auto self-end">
            <input
              placeholder="Type here"
              type="text"
              className=" p-2 w-full bg-[#171E3A] outline-none rounded-xl rounded-r-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#171E3A] text-white p-2 text-xl rounded-r-xl"
            >
              <VscSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatcontainer;
