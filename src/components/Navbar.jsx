/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#171e3a] text-white shadow-lg">
      <div className="flex justify-between container mx-auto p-4 px-7">
        <div>
          <a href="" className="text-2xl font-bold text-gray-200">
            Chatty
          </a>
        </div>
        <div>
          <button
            onClick={() => {
              localStorage.removeItem("data");
              navigate("/signin");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
