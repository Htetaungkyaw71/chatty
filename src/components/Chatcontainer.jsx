import { useState } from "react";
import {
  useAddMessageMutation,
  useGetAllMessageQuery,
} from "../redux/messageServices";
import { loadState } from "../redux/localstorage";
import axios from "axios";

/* eslint-disable react/prop-types */
const Chatcontainer = ({
  currentChat,
  roomId,
  currentUser,
  setroomId,
  refetch,
}) => {
  const [text, setText] = useState("");
  const {
    data,
    isLoading,
    refetch: recall,
  } = useGetAllMessageQuery({ roomId });
  const [addMessage] = useAddMessageMutation();
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const messages = data.data;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (e.key === "Enter") {
      // 👇️ your logic here
      console.log("Enter key pressed ✅");
      try {
        await addMessage({ text, roomId })
          .unwrap()
          .then((fulfilled) => {
            console.log(fulfilled);
            recall();
            setText("");
            alert("success");
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
  console.log(roomId);
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
      {currentChat && (
        <div className="flex flex-col h-[90vh] ">
          <div className="flex justify-between items-center border-b-[1px] p-2 border-gray-700 mb-3 ">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={`data:image/svg+xml;base64,${currentChat.otherUserAvater}`}
                className="rounded-xl w-10 h-10"
              />
              {currentChat.otherUserName}
            </div>
            <div>
              <button onClick={removeContact}>Remove</button>
            </div>
          </div>

          <div className="flex-1">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={
                    message.senderId === currentUser.id
                      ? "text-right"
                      : "text-left"
                  }
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between gap-3 w-full mx-auto px-auto self-end">
            <input
              placeholder="your message"
              type="text"
              className=" p-2 w-full bg-[#171E3A] outline-none rounded-xl"
              value={text}
              onKeyDown={handleSendMessage}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#171E3A] text-white p-2 rounded-xl"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatcontainer;
