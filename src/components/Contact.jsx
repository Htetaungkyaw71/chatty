/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { useGetAllMessageQuery } from "../redux/messageServices";
import { formatDateAndTime } from "./helper/date";

const Contact = ({ contact, currentUser }) => {
  const [roomId, setroomId] = useState(undefined);
  const { data, isLoading } = useGetAllMessageQuery({ roomId });
  useEffect(() => {
    const createRoom = async (otherUserId) => {
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
        setroomId(roomId);
      } catch (error) {
        console.error(error);
      }
    };
    createRoom(contact.otherUserId);
  }, []);

  if (isLoading) {
    return;
  }
  const results = data.data;
  const lastMessage = results[results.length - 1];

  return (
    <div className="mt-3 p-3 rounded-xl hover:bg-[#171E3A]">
      <div className="flex gap-3 items-center">
        <img
          src={`data:image/svg+xml;base64,${contact.otherUserAvater}`}
          className="rounded-xl w-10 h-10"
        />
        <div className="w-52">
          <div className="flex justify-between">
            <h1>{contact.otherUserName}</h1>
            <h1 className="text-sm text-gray-500 mt-1">
              {lastMessage && formatDateAndTime(lastMessage.createdAt)}
            </h1>
          </div>

          <h1 className="text-gray-500 text-left text-sm w-36">
            {lastMessage && lastMessage.text.slice(0, 15)}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Contact;
