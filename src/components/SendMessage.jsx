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
  messages,
}) => {
  const [text, setText] = useState("");
  const [showEmoji, setshowEmoji] = useState(false);
  const [addMessage] = useAddMessageMutation();

  const handleEmoji = (event) => {
    let message = text;
    message += event.emoji;
    setText(message);
  };
  console.log(messages);
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
          const r = data.roomId;
          setMessages((prev) => ({ ...prev, [r]: [...messages[r], data] }));
          setText("");
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (socket.current) {
      const socketRef = socket.current;
      socketRef.on("msg-recieve", (msg) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [msg.roomId]: [...prevMessages[msg.roomId], msg],
        }));
      });

      return () => {
        socketRef.off("msg-recieve");
      };
    }
  }, [socket.current, setMessages]);

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
