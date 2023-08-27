/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useAddMessageMutation } from "../redux/messageServices";
import { VscSend } from "react-icons/vsc";
import EmojiPicker from "emoji-picker-react";

const SendMessage = ({
  roomId,
  socket,
  currentChat,
  currentUser,
  setMessages,
  messages,
  setLastMessage,
  finalMessage,
}) => {
  const [text, setText] = useState("");
  const [showEmoji, setshowEmoji] = useState(false);
  const [addMessage] = useAddMessageMutation();

  const handleEmoji = (event) => {
    let message = text;
    message += event.emoji;
    setText(message);
  };
  useEffect(() => {
    setText("");
  }, [roomId]);

  const typingTimeoutRef = useRef(null);

  const handleTyping = () => {
    clearTimeout(typingTimeoutRef.current);

    socket.emit("typing", true);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", false);
    }, 2000);
  };

  console.log(roomId);

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
          socket.emit("send-msg", {
            to: currentChat.otherUserId,
            from: currentUser.id,
            msg: data,
          });
          const r = data.roomId;
          setMessages((prev) => ({ ...prev, [r]: [...messages[r], data] }));

          setText("");

          if (finalMessage.length > 0) {
            let filter = finalMessage.filter((f) => f.id !== roomId);
            let newArr = [...filter, { id: roomId, msg: data, status: true }];
            setLastMessage(newArr);
          } else {
            setLastMessage([{ id: roomId, msg: data, status: true }]);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (socket) {
      const socketRef = socket;
      socketRef.on("msg-recieve", (msg) => {
        console.log("msg", msg);
        setMessages((prevMessages) => ({
          ...prevMessages,
          [msg.roomId]: [...prevMessages[msg.roomId], msg],
        }));

        if (finalMessage.length > 0) {
          let newArr;
          let filter = finalMessage.filter((f) => f.id !== msg.roomId);
          console.log(roomId);
          newArr = [...filter, { id: msg.roomId, msg, status: false }];

          setLastMessage(newArr);
        } else {
          setLastMessage([{ id: msg.roomId, msg, status: false }]);
        }
      });

      return () => {
        socketRef.off("msg-recieve");
      };
    }
  }, [socket, setMessages]);

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
          className="p-2 w-full bg-[#171E3A] outline-none rounded-xl rounded-r-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button
          onClick={handleSendMessage}
          className={`bg-[#171E3A] p-2 text-xl rounded-r-xl ${
            text.length === 0 ? "text-gray-400" : "text-white"
          }`}
          disabled={text.length === 0}
        >
          <VscSend />
        </button>
      </div>
    </>
  );
};

export default SendMessage;
