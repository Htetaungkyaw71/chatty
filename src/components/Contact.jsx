/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { useGetAllMessageQuery } from "../redux/messageServices";
import { formatDateAndTimeForContact } from "./helper/date";

const Contact = ({
  contact,
  currentUser,
  onlineUsers,
  finalMessage,
  setRooms,
  allusers,
  lastdata,
}) => {
  const [roomId, setroomId] = useState(undefined);
  const { data, isLoading } = useGetAllMessageQuery({ roomId });
  const [avatar, setAvatar] = useState("");
  const [status, setStatus] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const createChatRoom = async (otherUserId) => {
      try {
        const response = await fetch("http://localhost:5000/api/createroom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify({ otherUserId }),
        });

        const data = await response.json();
        const roomId = data.roomId;
        setRooms((prev) => [...prev, { id: otherUserId, roomId }]);
        setroomId(roomId);

        const getUser = allusers.find(
          (user) => user.id === contact.otherUserId,
        );
        setStatus(getUser?.status ?? "");
        setAvatar(getUser?.avater ?? "");
      } catch (error) {
        console.error(error);
      }
    };

    createChatRoom(contact.otherUserId);
  }, []);
  console.log(data);

  if (isLoading) {
    return;
  }
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  lastdata = lastdata?.roomId === roomId && lastdata;

  const results = data.data;
  const lastMessage = results[results?.length - 1];

  const isIdIncluded =
    onlineUsers && onlineUsers.some((obj) => obj.id === contact.otherUserId);

  const lastM = finalMessage && finalMessage.find((m) => m.id === roomId);

  return (
    <div
      className="mt-3 p-3 rounded-xl hover:bg-[#171E3A]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered && status.length > 0 && (
        <div className={`text-sm text-left p-1 mb-1 absolute -mt-8 ml-3  `}>
          <span className=" bg-gray-700 text-gray-300 p-2 rounded-xl rounded-bl-none">
            {status}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex">
          <div>
            <img
              src={`data:image/svg+xml;base64,${avatar}`}
              className="rounded-xl w-10 h-10 inline-block"
            />
          </div>

          {isIdIncluded ? (
            <span className="bg-green-400 w-[10px] h-[10px] mt-6 -ml-2 mr-3 rounded-full inline-block"></span>
          ) : (
            <span className="w-[10px] h-[10px] -ml-2 mr-3 inline-block"></span>
          )}
          <div>
            <h1 className="flex items-center">{contact.otherUserName}</h1>
            <h1
              className={`text-gray-500 text-left text-sm w-36 ${
                lastM
                  ? !lastM.status && "text-white"
                  : lastdata && !lastdata.status && "text-white"
              }`}
            >
              {lastM
                ? lastM.msg.image
                  ? "image"
                  : lastM.msg.text.slice(0, 15)
                : lastdata
                ? lastdata?.image
                  ? "image"
                  : lastdata?.text.slice(0, 15)
                : lastMessage && lastMessage?.text?.slice(0, 15)}
            </h1>
          </div>
        </div>

        <h1 className="text-sm text-gray-500 mt-1">
          {lastMessage && formatDateAndTimeForContact(lastMessage.createdAt)}
        </h1>
      </div>
    </div>
  );
};

export default Contact;
