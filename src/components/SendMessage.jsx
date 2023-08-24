/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAddMessageMutation } from "../redux/messageServices";
import { VscSend } from "react-icons/vsc";
import EmojiPicker from "emoji-picker-react";

const SendMessage = ({
  roomId,
  socket,
  currentChat,
  currentUser,
  setMessages,
  recall,
}) => {
  const [text, setText] = useState("");
  const [showEmoji, setshowEmoji] = useState(false);
  const [addMessage] = useAddMessageMutation();
  // const [arrivalMessage, setArrivalMessage] = useState(null);
  const handleEmoji = (event) => {
    let message = text;
    message += event.emoji;
    setText(message);
  };

  useEffect(() => {
    setText("");
  }, [roomId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await addMessage({ text, roomId })
        .unwrap()
        .then((fulfilled) => {
          const data = {
            ...fulfilled.data,
            sender: {
              name: currentUser.name,
              avater: currentUser.avater,
            },
          };
          socket.current.emit("send-msg", {
            to: currentChat.otherUserId,
            from: currentUser.id,
            msg: data,
          });
          recall();
          // setMessages((prev) => [...prev, data]);
          setText("");
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (socket.current) {
      const socketRef = socket.current; // Create a local variable to hold the ref value
      socketRef.on("msg-recieve", (msg) => {
        recall();
        // setArrivalMessage(msg);
      });

      // Cleanup function to remove the event listener when the component unmounts
      return () => {
        socketRef.off("msg-recieve"); // Use the local variable in cleanup
      };
    }
  }, [socket.current]);

  // useEffect(() => {
  //   if (arrivalMessage) {
  //     setMessages((prev) => [...prev, arrivalMessage]);
  //   }
  // }, [arrivalMessage]);

  return (
    <>
      {showEmoji && <EmojiPicker onEmojiClick={handleEmoji} />}
      <div className="flex justify-between mt-3 w-full mx-auto px-auto self-end">
        <button
          className="mx-2 text-2xl"
          onClick={() => setshowEmoji(!showEmoji)}
        >
          😀
        </button>
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
    </>
  );
};

export default SendMessage;
