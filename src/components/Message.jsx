/* eslint-disable react/prop-types */

import { useState } from "react";
import { formatDateAndTime } from "./helper/date";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import {
  useDeleteMessageMutation,
  useUpdateMessageMutation,
} from "../redux/messageServices";

const Message = ({ message, currentUser, recall }) => {
  const [isHovered, setIsHovered] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [deleteMessage] = useDeleteMessageMutation();
  const [isEditable, setIsEditable] = useState(false);
  const [messageText, setMessageText] = useState(message.text);
  const [upateMessage] = useUpdateMessageMutation();

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
    console.log(message.id);
    try {
      await deleteMessage({ id: message.id })
        .unwrap()
        .then((fulfilled) => {
          console.log(fulfilled);
          recall();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
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
          recall();
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
        <div className="flex-shrink-0">
          <img
            src={`data:image/svg+xml;base64,${message.sender.avater}`}
            alt="Sender Avatar"
            className="rounded-xl w-10 h-10"
          />
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
          <div className="font-semibold">
            {message.sender.name}
            <span className="text-sm text-gray-500 font-medium ml-3">
              {formatDateAndTime(message.createdAt)}
            </span>
          </div>

          <div className="text-md text-gray-300">{message.text}</div>
        </div>
      )}
    </div>
  );
};

export default Message;
