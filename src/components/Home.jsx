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

const Home = () => {
  const navigate = useNavigate();
  const [allusers, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useGetAllContactQuery();
  const [searchResults, setSearchResults] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setcurrentUser] = useState(undefined);
  const [roomId, setroomId] = useState(undefined);

  useEffect(() => {
    const user = loadState();
    setcurrentUser(user);
    if (!user.isAvater) {
      navigate("/avatar");
    }
    refetch();
  }, []);

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

  if (isLoading) {
    return <MainLoader />;
  }
  const contacts = data.data;
  console.log(contacts);

  const handleContactClick = async (otherUserId) => {
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

  return (
    <div className="text-white">
      <Navbar />
      <div className="container mx-auto grid h-[80vh] grid-cols-4 p-4 gap-4">
        <div className="p-3 bg-[#1E2746] rounded-xl shadow-2xl shadow-[#171E3A] ">
          <form>
            <input
              placeholder={`Search`}
              type="text"
              className="p-2 rounded-xl bg-[#171E3A] outline-none w-full"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </form>
          {searchResults.length === 0 ? (
            <div className="h-[70vh] chat-scroll">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setCurrentChat(contact);
                    handleContactClick(contact.otherUserId);
                  }}
                >
                  <Contact contact={contact} currentUser={currentUser} />
                </button>
              ))}
            </div>
          ) : (
            <div className="h-[70vh] chat-scroll">
              {searchResults.map((user) => (
                <div key={user.id}>
                  <Results user={user} refetch={refetch} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-2 bg-[#1E2746] rounded-xl shadow-2xl text-white p-3">
          {roomId ? (
            <Chatcontainer
              currentChat={currentChat}
              setroomId={setroomId}
              roomId={roomId}
              currentUser={currentUser}
              refetch={refetch}
            />
          ) : (
            <Welcome currentUser={currentUser ? currentUser : "Loading"} />
          )}
        </div>
        <Profile currentUser={currentUser && currentUser} />
      </div>
    </div>
  );
};

export default Home;
