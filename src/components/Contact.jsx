import axios from "axios";
import { loadState } from "../redux/localstorage";

/* eslint-disable react/prop-types */

const Contact = ({ contact, refetch }) => {
  const removeContact = async (e) => {
    const user = loadState();
    e.preventDefault();
    try {
      const data = await axios.delete(
        `http://localhost:5000/api/contact/${contact.id}`,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        },
      );
      refetch();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mt-5">
      <div className="flex gap-2 mt-3">
        <img
          src={`data:image/svg+xml;base64,${contact.otherUserAvater}`}
          className="rounded-xl w-10 h-10"
        />
        <div>
          <h1>{contact.otherUserName}</h1>
          <h1 className="text-gray-400">{contact.otherUserEmail}</h1>
        </div>
        <div>
          <button onClick={removeContact}>Remove</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
