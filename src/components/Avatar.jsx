/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import axios from "axios";
import { loadState } from "../redux/localstorage";
import { useNavigate } from "react-router-dom";

const Avatar = () => {
  const navigate = useNavigate();
  const api = "https://api.multiavatar.com/3456789";
  const [avatar, setAvatar] = useState(undefined);
  const [selectedavatar, setSelectedAvatar] = useState(undefined);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}?apikey=04xqAaeZzHY5QX`,
        );
        const buffer = new Buffer(response.data);
        return buffer.toString("base64");
      } catch (error) {
        console.log(error);
      }
    };
    const fetchDataAndSetAvatar = async () => {
      const fetchPromises = Array.from({ length: 4 }, fetchData);
      const results = [];
      for (const fetchPromise of fetchPromises) {
        results.push(await fetchPromise);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      const validResults = results.filter((result) => result !== null);
      setAvatar(validResults);
      setisLoading(false);
    };

    fetchDataAndSetAvatar();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleProfile = async () => {
    if (selectedavatar === undefined) {
      alert("Select avatar");
    } else {
      const user = loadState();
      const { data } = await axios.put(
        `http://localhost:5000/updateprofile/${user.id}`,
        {
          image: avatar[selectedavatar],
        },
      );
      const result = data.data;
      console.log(result);
      console.log(user);
      if (result.isAvater) {
        user.avater = result.avater;
        user.isAvater = result.isAvater;
        localStorage.setItem("data", JSON.stringify(user));
        navigate("/");
      } else {
        alert("error fetch avatar");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#202329] text-gray-300">
      <div>
        <h1 className="text-center font-bold text-xl mb-10">
          Pick an avatar as your profile picture
        </h1>
        <div className="flex justify-around gap-2 sm:gap-2 md:gap-2 lg:gap-4 xl:gap-5">
          {avatar.map((i, index) => (
            <div key={index}>
              <img
                src={`data:image/svg+xml;base64,${i}`}
                alt="avatar"
                className={`w-20 h-20 cursor-pointer ${
                  selectedavatar === index
                    ? "border-2 rounded-full border-gray-300"
                    : "border-0"
                }`}
                onClick={() => setSelectedAvatar(index)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleProfile}
            className="text-center mt-10 border-2 p-3"
          >
            Save profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
