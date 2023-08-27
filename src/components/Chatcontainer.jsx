import { useEffect, useState } from "react";
import { useGetAllMessageQuery } from "../redux/messageServices";
import { loadState } from "../redux/localstorage";
import axios from "axios";
import Loader from "./helper/Loader";
import { useRef } from "react";
import { BiSolidVideo } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import Message from "./Message";
import { BiLeftArrowAlt } from "react-icons/bi";
import SendMessage from "./SendMessage";

/* eslint-disable react/prop-types */
const Chatcontainer = ({
  currentChat,
  roomId,
  currentUser,
  setroomId,
  refetch,
  socket,
  onlineUsers,
  setLastMessage,
  finalMessage,
  setBox,
  box,
}) => {
  const chatContainerRef = useRef(null);
  const [dot, setDot] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [typingStatus, setTypingStatus] = useState(false);
  const typeMessage = useRef(null);

  const {
    data,
    isLoading,
    refetch: recall,
  } = useGetAllMessageQuery({ roomId });

  const [messagesData, setMessagesData] = useState({});

  useEffect(() => {
    typeMessage.current?.scrollIntoView({ behavior: "smooth" });
  }, [typingStatus]);

  useEffect(() => {
    if (roomId && data) {
      recall();
      setMessagesData((prev) => ({
        ...prev,
        [roomId]: data.data,
      }));
    }
  }, [roomId, data]);

  useEffect(() => {
    const lastMessage = chatContainerRef.current.querySelector(
      ".last-message > div:last-child",
    );
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [messagesData]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/users/${currentChat.otherUserId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser.token}`,
            },
          },
        );

        const data = await response.json();
        const { avater } = data.data;
        setAvatar(avater);
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, [roomId]);

  useEffect(() => {
    socket.on("typingResponse", (data) => setTypingStatus(data));
  }, [socket]);

  if (isLoading) {
    return <Loader />;
  }

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

  const isIdIncluded =
    onlineUsers &&
    onlineUsers.some((obj) => obj.id === currentChat.otherUserId);

  const handleback = (e) => {
    e.preventDefault();
    setBox(false);
  };

  return (
    <div>
      {dot && (
        <div className="z-10 absolute right-64 bg-white text-black p-3 top-14 rounded-xl rounded-bl-none">
          <button onClick={removeContact}>Remove contact</button>
        </div>
      )}
      {currentChat && (
        <div className="flex flex-col  h-[80vh] ">
          <div className="flex justify-between items-center border-b-[1px] p-2 border-gray-700 mb-3 ">
            <div className="flex items-center gap-2">
              {box && (
                <button
                  onClick={handleback}
                  className="hover:bg-[#171E3A] rounded-full p-[10px] -mt-[6px] inline-block "
                >
                  <BiLeftArrowAlt className="text-2xl" />
                </button>
              )}
              <div className="flex items-center mb-2">
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  className="rounded-xl w-10 h-10"
                />
                {isIdIncluded ? (
                  <span className="bg-green-400 w-[10px] h-[10px] mt-6 -ml-2 mr-3 rounded-full"></span>
                ) : (
                  <span className="w-[10px] h-[10px] mt-6 -ml-2 mr-3 rounded-full"></span>
                )}
                <div>
                  <h1 className="text-[16px]"> {currentChat.otherUserName}</h1>
                  {isIdIncluded && (
                    <h1 className="text-sm text-gray-400">Active now</h1>
                  )}
                </div>
              </div>
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
            {messagesData[roomId] &&
              messagesData[roomId].map((message) => (
                <div key={message.id}>
                  <Message
                    message={message}
                    currentUser={currentUser}
                    recall={recall}
                    socket={socket}
                    currentChat={currentChat}
                    messages={messagesData}
                    setMessages={setMessagesData}
                    isIdIncluded={isIdIncluded}
                  />
                </div>
              ))}
            {typingStatus && (
              <div className="flex gap-3 items-center mt-5" ref={typeMessage}>
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="Sender Avatar"
                  className="rounded-xl w-10 h-10"
                />
                <div className="mloader">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
          </div>
          <SendMessage
            roomId={roomId}
            socket={socket}
            currentChat={currentChat}
            currentUser={currentUser}
            recall={recall}
            messages={messagesData}
            setMessages={setMessagesData}
            setLastMessage={setLastMessage}
            finalMessage={finalMessage}
          />
        </div>
      )}
    </div>
  );
};

export default Chatcontainer;
