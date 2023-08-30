import { useEffect, useState } from "react";
import { useGetAllMessageQuery } from "../redux/messageServices";
import { loadState } from "../redux/localstorage";
import axios from "axios";
import Loader from "./helper/Loader";
import { useRef } from "react";
import { BiSolidVideo } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import Message from "./Message";
import { BiLeftArrowAlt } from "react-icons/bi";
import SendMessage from "./SendMessage";
import Peer from "simple-peer";

/* eslint-disable react/prop-types */
const Chatcontainer = ({
  currentChat,
  roomId,
  currentUser,
  setroomId,
  refetch,
  socket,
  onlineUsers,
  setLastMessage,
  finalMessage,
  setBox,
  box,
  allusers,
}) => {
  const chatContainerRef = useRef(null);
  const [dot, setDot] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [typingStatus, setTypingStatus] = useState(false);
  const typeMessage = useRef(null);

  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [status, setStatus] = useState(false);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const meRef = useRef();

  const {
    data,
    isLoading,
    refetch: recall,
  } = useGetAllMessageQuery({ roomId });

  useEffect(() => {
    const user =
      onlineUsers && onlineUsers.find((obj) => obj.id === currentUser.id);
    meRef.current = user.socketID;
    setMe(user.socketID);
    // socket.on("me", (id) => {
    //   console.log(id);
    //   setMe(id);
    // });

    socket.on("callUser", (data) => {
      console.log("data", data);
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, [socket]);

  console.log(me);

  const [messagesData, setMessagesData] = useState({});

  useEffect(() => {
    typeMessage.current?.scrollIntoView({ behavior: "smooth" });
  }, [typingStatus]);

  useEffect(() => {
    if (roomId && data) {
      recall();
      setMessagesData((prev) => ({
        ...prev,
        [roomId]: data.data,
      }));
    }
  }, [roomId, data]);

  useEffect(() => {
    const lastMessage = chatContainerRef.current.querySelector(
      ".last-message > div:last-child",
    );
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [messagesData]);

  useEffect(() => {
    const getUser = allusers.find(
      (user) => user.id === currentChat.otherUserId,
    );
    setAvatar(getUser.avater);
  }, [roomId]);

  useEffect(() => {
    socket.on("typingResponse", (data) => setTypingStatus(data));
  }, [socket]);

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

  const isIdIncluded =
    onlineUsers &&
    onlineUsers.some((obj) => obj.id === currentChat.otherUserId);

  const handleback = (e) => {
    e.preventDefault();
    setBox(false);
  };

  const initialVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera and microphone:", error);
      // Handle error and provide feedback to the user
    }
  };

  const handleVideoCall = async () => {
    setStatus(!status);
    initialVideo();
  };

  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    const otherId =
      onlineUsers &&
      onlineUsers.find((obj) => obj.id === currentChat.otherUserId);
    setIdToCall(otherId.socketID);
  }, [currentChat]);

  // console.log("myVideo", myVideo);

  const callUser = (id) => {
    console.log(id);
    console.log("Stream:", stream);
    console.log("Me:", meRef.current);
    initialVideo();
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    console.log(peer);
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: meRef.current,
      });
      console.log("singal", data);
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  if (isLoading) {
    return <Loader />;
  }

  // console.log(stream);

  return (
    <>
      {status ? (
        <div className="container">
          <div className="video-container">
            <div className="video">
              {stream && (
                <video
                  playsInline
                  muted
                  ref={myVideo}
                  autoPlay
                  style={{ width: "300px", height: "300px" }}
                />
              )}
            </div>
            <div className="video">
              {callAccepted && !callEnded ? (
                <video
                  playsInline
                  ref={userVideo}
                  autoPlay
                  style={{ width: "300px", height: "300px" }}
                />
              ) : null}
            </div>
          </div>
          <div className="myId">
            {/* <TextField
              id="filled-basic"
              label="Name"
              variant="filled"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginBottom: "20px" }}
            /> */}
            {/* <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AssignmentIcon fontSize="large" />}
              >
                Copy ID
              </Button>
            </CopyToClipboard> */}
            {/*
            <TextField
              id="filled-basic"
              label="ID to call"
              variant="filled"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
            /> */}
            <div className="call-button">
              {callAccepted && !callEnded ? (
                <button color="secondary" onClick={leaveCall}>
                  End Call
                </button>
              ) : (
                <button
                  color="primary"
                  aria-label="call"
                  onClick={() => callUser(idToCall)}
                >
                  Accept
                  {/* <PhoneIcon fontSize="large" /> */}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {dot && (
            <div className="z-10 absolute right-5 bg-white text-[#171E3A] p-3 top-14 rounded-xl ">
              <button onClick={removeContact}>Remove contact</button>
            </div>
          )}
          {currentChat && (
            <div className="flex flex-col  h-[80vh] ">
              <div>
                {receivingCall && !callAccepted ? (
                  <div className="caller">
                    <h1>{name} is calling...</h1>
                    <button color="primary" onClick={answerCall}>
                      Answer
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="flex justify-between items-center border-b-[1px] p-2 border-gray-700 mb-3 ">
                <div className="flex items-center gap-2">
                  {box && (
                    <button
                      onClick={handleback}
                      className="hover:bg-[#171E3A] rounded-full p-[10px] -mt-[6px] inline-block "
                    >
                      <BiLeftArrowAlt className="text-2xl" />
                    </button>
                  )}
                  <div className="flex items-center mb-2">
                    <img
                      src={`data:image/svg+xml;base64,${avatar}`}
                      className="rounded-xl w-10 h-10"
                    />
                    {isIdIncluded ? (
                      <span className="bg-green-400 w-[10px] h-[10px] mt-6 -ml-2 mr-3 rounded-full"></span>
                    ) : (
                      <span className="w-[10px] h-[10px] mt-6 -ml-2 mr-3 rounded-full"></span>
                    )}
                    <div>
                      <h1 className="text-[16px]">
                        {" "}
                        {currentChat.otherUserName}
                      </h1>
                      {isIdIncluded && (
                        <h1 className="text-sm text-gray-400">Active now</h1>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={handleVideoCall}>
                    <BiSolidVideo className="text-2xl" />
                  </button>
                  <button onClick={() => setDot(!dot)}>
                    <BsThreeDotsVertical className="text-xl" />
                  </button>
                </div>
              </div>

              <div
                className="flex-1 chat-scroll last-message p-3 text-gray-100"
                ref={chatContainerRef}
              >
                {messagesData[roomId] &&
                  messagesData[roomId].map((message) => (
                    <div key={message.id}>
                      <Message
                        message={message}
                        currentUser={currentUser}
                        recall={recall}
                        socket={socket}
                        currentChat={currentChat}
                        messages={messagesData}
                        setMessages={setMessagesData}
                        isIdIncluded={isIdIncluded}
                      />
                    </div>
                  ))}
                {typingStatus && (
                  <div
                    className="flex gap-3 items-center mt-5"
                    ref={typeMessage}
                  >
                    <img
                      src={`data:image/svg+xml;base64,${avatar}`}
                      alt="Sender Avatar"
                      className="rounded-xl w-10 h-10"
                    />
                    <div className="mloader">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                )}
              </div>
              <SendMessage
                roomId={roomId}
                socket={socket}
                currentChat={currentChat}
                currentUser={currentUser}
                recall={recall}
                messages={messagesData}
                setMessages={setMessagesData}
                setLastMessage={setLastMessage}
                finalMessage={finalMessage}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chatcontainer;
