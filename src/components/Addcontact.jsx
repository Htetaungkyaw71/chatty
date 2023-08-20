/* eslint-disable react/prop-types */
import { AiOutlineUserAdd } from "react-icons/ai";
import { useAddContactMutation } from "../redux/contactServices";

const Addcontact = ({ user, refetch }) => {
  const [addContact] = useAddContactMutation();
  const contactUser = {
    otherUserId: user.id,
    otherUserName: user.name,
    otherUserEmail: user.email,
    otherUserAvater: user.avater,
  };

  const handleContact = async (e) => {
    e.preventDefault();
    try {
      await addContact(contactUser)
        .unwrap()
        .then((fulfilled) => {
          console.log(fulfilled);
          refetch();
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button onClick={handleContact}>
        <AiOutlineUserAdd className="text-2xl font-bold" />
      </button>
    </div>
  );
};

export default Addcontact;
