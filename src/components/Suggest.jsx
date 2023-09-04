/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import Results from "./Results";

const Suggest = ({
  setProfile,
  setSuggest,
  allusers,
  currentUser,
  contacts,
  refetch,
}) => {
  const [suggests, setsuggestPeople] = useState([]);
  useEffect(() => {
    const excludeallusers = allusers.filter(
      (user) => user.id !== currentUser.id,
    );
    const filteredAllUsersExcludingContacts = excludeallusers.filter(
      (user) => !contacts.some((contact) => contact.otherUserId === user.id),
    );

    function getRandomElement(arr) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    }

    const randomDataArray = [];

    if (filteredAllUsersExcludingContacts.length > 5) {
      for (let i = 0; i < 5; i++) {
        const randomData = getRandomElement(filteredAllUsersExcludingContacts);
        if (!randomDataArray.includes(randomData)) {
          randomDataArray.push(randomData);
        }
      }
      setsuggestPeople(randomDataArray);
    } else {
      setsuggestPeople(filteredAllUsersExcludingContacts);
    }
  }, []);

  const handleback = (e) => {
    e.preventDefault();
    setProfile(false);
    setSuggest(false);
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
      <div className="h-[70vh] chat-scroll">
        <h1 className="text-center text-lg">Contact Suggestions</h1>
        {suggests.map((user) => (
          <div key={user.id} className="w-full">
            <Results user={user} refetch={refetch} setSuggest={setSuggest} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggest;
