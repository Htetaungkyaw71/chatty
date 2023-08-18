import { useState } from "react";
import {
  useAddMessageMutation,
  useGetAllMessageQuery,
} from "../redux/messageServices";

/* eslint-disable react/prop-types */
const Chatcontainer = ({ currentChat, roomId, currentUser }) => {
  console.log(roomId);
  const [text, setText] = useState("");
  const { data, isLoading, refetch } = useGetAllMessageQuery({ roomId });
  const [addMessage] = useAddMessageMutation();
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const messages = data.data;
  console.log(messages);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await addMessage({ text, roomId })
        .unwrap()
        .then((fulfilled) => {
          console.log(fulfilled);
          refetch();
          alert("success");
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {currentChat && (
        <div>
          {currentChat.otherUserName}
          <div>
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

          <form className="bottom-0 absolute">
            <input
              placeholder="send a message"
              type="text"
              className="w-full p-2 bg-black"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatcontainer;
