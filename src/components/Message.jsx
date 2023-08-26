/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { formatDateAndTime } from "./helper/date";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import {
  useDeleteMessageMutation,
  useUpdateMessageMutation,
} from "../redux/messageServices";
import EmojiPicker from "emoji-picker-react";

const Message = ({
  message,
  currentUser,
  socket,
  currentChat,
  messages,
  setMessages,
  isIdIncluded,
}) => {
  const [isHovered, setIsHovered] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [deleteMessage] = useDeleteMessageMutation();
  const [isEditable, setIsEditable] = useState(false);
  const [messageText, setMessageText] = useState(message.text);
  const [upateMessage] = useUpdateMessageMutation();
  const [showEmoji, setshowEmoji] = useState(false);

  const handleEmoji = (event) => {
    let message = messageText;
    message += event.emoji;
    setMessageText(message);
  };

  const handleMouseEnter = (messageId) => {
    if (!isEditable) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      const timeout = setTimeout(() => {
        setIsHovered(messageId);
      }, 400);
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHoverTimeout(null);
    setIsHovered(null);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteMessage({ id: message.id })
        .unwrap()
        .then((fulfilled) => {
          console.log(fulfilled);
          socket.emit("del-msg", {
            to: currentChat.otherUserId,
            from: currentUser.id,
            id: message.id,
          });
          const filter = messages[message.roomId].filter(
            (msg) => msg.id !== message.id,
          );
          setMessages((prev) => ({ ...prev, [message.roomId]: filter }));
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (socket) {
      const socketRef = socket;

      socketRef.on("del-recieve", (id) => {
        const filter = messages[message.roomId].filter((msg) => msg.id !== id);
        setMessages((prev) => ({ ...prev, [message.roomId]: filter }));
      });

      return () => {
        socketRef.off("del-recieve");
      };
    }
  }, [socket, setMessages]);

  useEffect(() => {
    if (socket) {
      const socketRef = socket;

      socketRef.on("edit-recieve", (data) => {
        const filter = messages[message.roomId].map((obj) => {
          if (obj.id === data.id) {
            return { ...obj, text: data.msg };
          }
          return obj;
        });
        setMessages((prev) => ({ ...prev, [message.roomId]: filter }));
      });

      return () => {
        socketRef.off("edit-recieve");
      };
    }
  }, [socket, setMessages]);

  const handleEdit = () => {
    setshowEmoji(false);
    handleMouseLeave();
    setMessageText(message.text);
    setIsEditable(!isEditable);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await upateMessage({ id: message.id, text: messageText })
        .unwrap()
        .then((fulfilled) => {
          console.log(fulfilled);
          socket.emit("edit-msg", {
            to: currentChat.otherUserId,
            from: currentUser.id,
            id: message.id,
            msg: messageText,
          });
          const filter = messages[message.roomId].map((obj) => {
            if (obj.id === message.id) {
              return { ...obj, text: messageText };
            }
            return obj;
          });
          setMessages((prev) => ({ ...prev, [message.roomId]: filter }));
          setshowEmoji(false);
          setIsEditable(!isEditable);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      key={message.id}
      className={
        message.senderId === currentUser.id
          ? "block text-left mt-5 "
          : "flex gap-2 mt-5"
      }
    >
      {message.senderId !== currentUser.id && (
        <div className="flex">
          <img
            src={`data:image/svg+xml;base64,${message.sender.avater}`}
            alt="Sender Avatar"
            className="rounded-xl w-10 h-10"
          />
          {isIdIncluded && (
            <span className="bg-green-400 w-[10px] h-[10px] mt-[26px] -ml-2 mr-[2px] inline-block rounded-full"></span>
          )}
        </div>
      )}

      {message.senderId === currentUser.id ? (
        <>
          <div
            className={`relative text-right text-gray-300`}
            onMouseEnter={() => handleMouseEnter(message.id)}
            onMouseLeave={handleMouseLeave}
          >
            {isEditable ? (
              <div className="gap-2">
                <button className="mr-2" onClick={handleSave}>
                  Save
                </button>
                <button className="mr-2" onClick={handleEdit}>
                  Dismiss
                </button>

                <button
                  className="mx-2 text-xl"
                  onClick={() => setshowEmoji(!showEmoji)}
                >
                  😀
                </button>
                <input
                  type="text"
                  className="bg-[#171E3A] text-white p-2 text-md rounded-xl"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>
            ) : (
              message.text
            )}
            {showEmoji && <EmojiPicker onEmojiClick={handleEmoji} />}
            {isHovered === message.id && (
              <div className="flex bg-white text-gray-500 shadow-lg absolute top-0 right-0 mt-8  mr-2 w-24 rounded-xl">
                <button
                  className="p-2 text-center hover:bg-gray-300 w-full rounded-l-xl"
                  onClick={handleEdit}
                >
                  <AiOutlineEdit className="inline text-xl" />
                </button>
                <hr />
                <button
                  className=" p-2 text-center hover:bg-gray-300 w-full rounded-r-xl"
                  onClick={handleDelete}
                >
                  <BsTrash className="inline text-xl" />
                </button>
              </div>
            )}

            <div className="text-sm text-gray-500 ">
              {formatDateAndTime(message.createdAt)}
            </div>
          </div>
        </>
      ) : (
        <div className="text-left">
          <div className="text-[18px]">
            {message.sender.name}
            <span className="text-sm text-gray-500 font-medium ml-3">
              {formatDateAndTime(message.createdAt)}
            </span>
          </div>

          <div className="text-[16px] text-gray-300">{message.text}</div>
        </div>
      )}
    </div>
  );
};

export default Message;
