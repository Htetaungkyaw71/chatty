/* eslint-disable react/prop-types */
import Navbar from "./Navbar";
import { useGetAllContactQuery } from "../redux/contactServices";
import Contact from "./Contact";
import { useEffect, useState } from "react";
import { loadState } from "../redux/localstorage";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chatcontainer from "./Chatcontainer";
import Welcome from "./helper/Welcome";
import MainLoader from "./helper/MainLoader";
import Profile from "./Profile";
import Results from "./Results";
import { RxHamburgerMenu } from "react-icons/rx";

const Home = ({ socket }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();
  const [allusers, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useGetAllContactQuery();
  const [searchResults, setSearchResults] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setcurrentUser] = useState(undefined);
  const [roomId, setroomId] = useState(undefined);
  const [finalMessage, setLastMessage] = useState([]);
  const [toogle, setToogle] = useState(false);
  const [profile, setProfile] = useState(false);
  const [box, setBox] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const user = loadState();
    setcurrentUser(user);
    if (!user.isAvater) {
      navigate("/avatar");
    }
    refetch();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.emit("add-user", currentUser.id);
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });
      socket.emit("newUser", {
        id: currentUser.id,
        socketID: socket.id,
      });
    }
  }, [currentUser, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("newUserResponse", (data) => setOnlineUsers(data));
    }
  }, [socket, onlineUsers]);

  useEffect(() => {
    const user = loadState();
    const fetchUsers = async () => {
      const users = await axios.get("http://localhost:5000/users", {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      });
      setUsers(users.data.data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (search.length === 0) {
      setSearchResults([]);
    } else {
      const excludeallusers = allusers.filter(
        (user) => user.id !== currentUser.id,
      );
      const filteredAllUsersExcludingContacts = excludeallusers.filter(
        (user) => !contacts.some((contact) => contact.otherUserId === user.id),
      );
      const searchUser = filteredAllUsersExcludingContacts.filter((user) => {
        const lowerSearch = search.toLowerCase();
        const email = user.email.split("@")[0];
        return (
          user.name.toLowerCase().includes(lowerSearch) ||
          email.toLowerCase().includes(lowerSearch)
        );
      });
      setSearchResults(searchUser);
    }
  }, [search, data]);

  useEffect(() => {
    const updateBoxState = () => {
      if (window.innerWidth > 1023) {
        setBox(false);
      }
    };
    updateBoxState();
    window.addEventListener("resize", updateBoxState);
    return () => {
      window.removeEventListener("resize", updateBoxState);
    };
  }, []);

  if (isLoading) {
    return <MainLoader />;
  }
  const contacts = data?.data ?? [];

  const handleContactClick = async (otherUserId) => {
    const rId = rooms.find((room) => room.id === otherUserId);
    setroomId(rId.roomId);
    finalMessage.map((f) => {
      if (f.id === rId.roomId) {
        return (f.status = true);
      }
    });
  };

  const handleHamburger = (e) => {
    e.preventDefault();
    setToogle(!toogle);
  };

  const handleProfile = (e) => {
    e.preventDefault();
    setToogle(false);
    setProfile(true);
  };

  return (
    <div className="text-white">
      <Navbar />
      <div className="container mx-auto grid h-[80vh] grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 p-4 gap-4 ">
        {profile ? (
          <Profile
            currentUser={currentUser && currentUser}
            setProfile={setProfile}
          />
        ) : (
          <div
            className={`p-3 bg-[#1E2746] rounded-xl shadow-2xl shadow-[#171E3A] ${
              box && "hidden"
            }`}
          >
            <form className="flex items-center gap-3">
              <button onClick={handleHamburger}>
                <RxHamburgerMenu className="text-2xl ml-4 " />
              </button>
              <input
                placeholder={`Search`}
                type="text"
                className="p-2 rounded-xl bg-[#171E3A] outline-none w-full"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </form>
            {toogle && (
              <div className="bg-[#171E3A] mt-3 p-3 absolute w-60 rounded-xl">
                <button
                  className="block p-2 hover:bg-[#1E2746] rounded-xl mt-1 pl-3 w-full text-left"
                  onClick={handleProfile}
                >
                  Profile
                </button>
                <button className="block p-2 hover:bg-[#1E2746] rounded-xl mt-1 pl-3 w-full text-left">
                  Settings
                </button>
                <button className="block p-2 hover:bg-[#1E2746] rounded-xl mt-1 pl-3 w-full text-left">
                  Features
                </button>
                <button className="block p-2 hover:bg-[#1E2746] rounded-xl mt-1 pl-3 mb-1 w-full text-left">
                  Report Bugs
                </button>
              </div>
            )}

            {searchResults.length === 0 ? (
              <div className="h-[70vh] chat-scroll">
                {contacts.map((contact) => (
                  <button
                    className="block w-full"
                    key={contact.id}
                    onClick={() => {
                      if (window.innerWidth < 1023) {
                        setBox(true);
                      }

                      setCurrentChat(contact);
                      handleContactClick(contact.otherUserId);
                    }}
                  >
                    <Contact
                      contact={contact}
                      currentUser={currentUser}
                      onlineUsers={onlineUsers}
                      finalMessage={finalMessage}
                      setRooms={setRooms}
                      allusers={allusers}
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="h-[70vh] chat-scroll">
                {searchResults.map((user) => (
                  <div key={user.id} className="w-full">
                    <Results user={user} refetch={refetch} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className={`col-span-3 bg-[#1E2746] rounded-xl shadow-2xl text-white p-3 ${
            box ? "block" : "hidden sm:hidden md:hidden lg:block xl:block"
          }`}
        >
          {roomId ? (
            <Chatcontainer
              currentChat={currentChat}
              setroomId={setroomId}
              roomId={roomId}
              currentUser={currentUser}
              refetch={refetch}
              socket={socket}
              onlineUsers={onlineUsers}
              setLastMessage={setLastMessage}
              finalMessage={finalMessage}
              setBox={setBox}
              box={box}
              allusers={allusers}
            />
          ) : (
            <Welcome currentUser={currentUser ? currentUser : "Loading"} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
