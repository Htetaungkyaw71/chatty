/* eslint-disable react/prop-types */
import { useState } from "react";
import { useAddMessageMutation } from "../redux/messageServices";
import { VscSend } from "react-icons/vsc";
import EmojiPicker from "emoji-picker-react";

const SendMessage = ({ roomId, recall }) => {
  const [text, setText] = useState("");
  const [showEmoji, setshowEmoji] = useState(false);
  const [addMessage] = useAddMessageMutation();
  const handleEmoji = (event) => {
    let message = text;
    message += event.emoji;
    setText(message);
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await addMessage({ text, roomId })
        .unwrap()
        .then((fulfilled) => {
          console.log(fulfilled);
          recall();
          setText("");
        });
    } catch (error) {
      console.log(error);
    }
  };

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
