/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { loadState } from "../redux/localstorage";

const Profile = ({ currentUser, setProfile, setcurrentUser }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [ustatus, setuStatus] = useState(currentUser.status);

  const handleback = (e) => {
    e.preventDefault();
    setProfile(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status.length === 0) {
      toast.error("please provide status", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      try {
        const user = loadState();
        const updateStatus = await axios.put(
          `http://localhost:5000/updatestatus/${currentUser.id}`,
          {
            status,
          },
        );
        user.status = updateStatus.data.data.status;
        localStorage.setItem("data", JSON.stringify(user));
        setcurrentUser(user);
        setuStatus(updateStatus.data.data.status);
        setStatus("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="p-3 bg-[#1E2746] rounded-xl shadow-2xl shadow-[#171E3A]">
      {" "}
      <ToastContainer />
      <div>
        <button
          onClick={handleback}
          className="hover:bg-[#171E3A] rounded-full p-3"
        >
          <BiLeftArrowAlt className="text-2xl" />
        </button>
      </div>
      <div className="flex justify-center text-center pt-10">
        <div>
          <img
            src={`data:image/svg+xml;base64,${
              currentUser && currentUser.avater
            }`}
            className="rounded-xl w-20 h-20 inline-block"
          />
          <h1 className="mt-3 text-xl font-bold">
            {currentUser && currentUser.name}
          </h1>
          <h1 className="mt-2 text-lg text-gray-300 mb-5">
            {currentUser && currentUser.email}
          </h1>
          <h1 className="text-gray-400 mb-3">{ustatus}</h1>

          <hr />
          <div className="mt-5 mb-5">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={status}
                className="text-white bg-transparent outline-none p-1"
                placeholder="What is your status?"
                onChange={(e) => setStatus(e.target.value)}
              />
              <button
                type="submit"
                className="ml-3 p-1 border-[1px] rounded-xl border-[#45CFE1] text-[#45CFE1] hover:bg-[#45CFE1] hover:text-white"
              >
                Save
              </button>
            </form>
          </div>
          <hr />
          <div className="flex items-center gap-5 mt-5">
            <Link
              to="/avatar"
              className="flex items-center justify-center text-center gap-2 "
            >
              Change Avatar <FiEdit2 className="inline text-sm" />
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("data");
                navigate("/signin");
              }}
              className="border-[1px] p-2 py-1 rounded-xl border-[#45CFE1] text-[#45CFE1] hover:bg-[#45CFE1] hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
