import Navbar from "./Navbar";
import { useGetAllContactQuery } from "../redux/contactServices";
import Contact from "./Contact";
import { useEffect, useState } from "react";
import { loadState } from "../redux/localstorage";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Addcontact from "./Addcontact";
import Chatcontainer from "./Chatcontainer";

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
    return <div>Loading...</div>;
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
      <div className="container mx-auto grid grid-cols-5 h-screen p-4">
        <div className="bg-blue-300 p-3">
          <form>
            <input
              placeholder={`Search`}
              type="text"
              className="p-2 rounded-xl bg-[#2e333d] outline-none"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <div>
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="bg-[#2e333d] w-72 mt-4 p-3 rounded-xl flex justify-between items-center"
                >
                  <div className="flex gap-2">
                    <img
                      src={`data:image/svg+xml;base64,${user.avater}`}
                      className="rounded-xl w-10 h-10"
                    />
                    <div>
                      <h1>{user.name}</h1>
                      <h1 className="text-gray-400">{user.email}</h1>
                    </div>
                  </div>

                  <div>
                    <Addcontact user={user} refetch={refetch} />
                  </div>
                </div>
              ))}
            </div>
          </form>
          <div>
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  setCurrentChat(contact);
                  handleContactClick(contact.otherUserId);
                }}
              >
                <Contact contact={contact} />
              </button>
            ))}
          </div>
        </div>
        <div className="col-span-3 text-white bg-red-500 p-3">
          {roomId && (
            <Chatcontainer
              currentChat={currentChat}
              setroomId={setroomId}
              roomId={roomId}
              currentUser={currentUser}
              refetch={refetch}
            />
          )}
        </div>
        <div className="bg-black"></div>
      </div>
    </div>
  );
};

export default Home;
