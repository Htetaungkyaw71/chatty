/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { BiLeftArrowAlt } from "react-icons/bi";

const Profile = ({ currentUser, setProfile }) => {
  const navigate = useNavigate();

  const handleback = (e) => {
    e.preventDefault();
    setProfile(false);
  };

  return (
    <div className="p-3 bg-[#1E2746] rounded-xl shadow-2xl shadow-[#171E3A]">
      <div>
        <button
          onClick={handleback}
          className="hover:bg-[#171E3A] rounded-full p-3"
        >
          <BiLeftArrowAlt className="text-2xl" />
        </button>
      </div>
      <div className="flex justify-center text-center pt-20">
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
