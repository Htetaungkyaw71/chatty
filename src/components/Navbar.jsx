/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#202329] text-white border-b-[2px] border-black">
      <div className="flex justify-between container mx-auto p-4 px-7">
        <div>
          <a href="">Chatty</a>
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
