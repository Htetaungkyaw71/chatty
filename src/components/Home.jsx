import Navbar from "./Navbar";
import { useGetAllContactQuery } from "../redux/contactServices";
import Contact from "./Contact";
import { useEffect, useState } from "react";
import { loadState } from "../redux/localstorage";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [allusers, setUsers] = useState([]);
  const { data, isLoading } = useGetAllContactQuery();

  useEffect(() => {
    const user = loadState();
    if (!user.isAvater) {
      navigate("/avatar");
    }
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(allusers);
  const contacts = data.data;

  return (
    <div className="bg-[#202329] text-white">
      <Navbar />
      <div className="container mx-auto grid grid-cols-4 h-screen p-4">
        <div>
          <form>
            <input
              placeholder={`Search`}
              type="text"
              className="p-2 rounded-xl bg-[#2e333d] outline-none"
            />
          </form>
          <div>
            {contacts.map((contact) => (
              <div key={contact.id}>
                <Contact contact={contact} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-3 bg-white"></div>
      </div>
    </div>
  );
};

export default Home;
