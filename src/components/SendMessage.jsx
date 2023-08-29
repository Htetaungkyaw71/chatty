/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useAddMessageMutation } from "../redux/messageServices";
import { VscSend } from "react-icons/vsc";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { BsCardImage } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";

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
  const [imgData, setimgData] = useState(null);

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

    if (imgData === null) {
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
            console.log(data);
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
    } else {
      try {
        const formData = new FormData();
        formData.append("image", imgData);
        formData.append("roomId", roomId);
        formData.append("text", text);
        const response = await axios.post(
          `http://localhost:5000/api/message/image`,
          formData,
          {
            headers: {
              Authorization: "Bearer " + currentUser.token,
            },
          },
        );
        const img = response.data.data;
        const data = {
          ...img,
          sender: {
            name: currentUser.name,
            avater: currentUser.avater,
          },
        };
        console.log(response.data.data);
        socket.emit("send-msg", {
          to: currentChat.otherUserId,
          from: currentUser.id,
          msg: data,
        });
        const r = data.roomId;
        setMessages((prev) => ({ ...prev, [r]: [...messages[r], data] }));
        if (finalMessage.length > 0) {
          let filter = finalMessage.filter((f) => f.id !== roomId);
          let newArr = [...filter, { id: roomId, msg: data, status: true }];
          setLastMessage(newArr);
        } else {
          setLastMessage([{ id: roomId, msg: data, status: true }]);
        }
        setimgData(null);
        setText("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (socket) {
      const socketRef = socket;
      socketRef.on("msg-recieve", (msg) => {
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
      {imgData && (
        <div>
          <button onClick={() => setimgData("")} className="ml-[50px]">
            <RxCrossCircled />
          </button>
          <img
            src={imgData ? URL.createObjectURL(imgData) : ""}
            className="w-16 h-20"
          />
        </div>
      )}

      {showEmoji && <EmojiPicker onEmojiClick={handleEmoji} />}
      <form
        className="flex justify-between mt-3 w-full mx-auto px-auto self-end"
        onSubmit={handleSendMessage}
        encType="multipart/form-data"
        accept="image/*"
      >
        <BsCardImage id="imageCard" alt="Image" className="img-icon" />
        <label className="upload-button">
          <input
            className="hidden"
            type="file"
            name="img_url"
            onChange={(e) => setimgData(e.target.files[0])}
          />
        </label>
        <button
          type="button"
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
          type="submit"
          className={`bg-[#171E3A] p-2 text-xl rounded-r-xl ${
            text.length === 0 && (imgData === null || imgData === "")
              ? "text-gray-400"
              : "text-white"
          }`}
          disabled={text.length === 0 && (imgData === null || imgData === "")}
        >
          <VscSend />
        </button>
      </form>
    </>
  );
};

export default SendMessage;
