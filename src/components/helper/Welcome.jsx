/* eslint-disable react/prop-types */
import welcome from "../../assets/welcome.gif";

const Welcome = ({ currentUser }) => {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div>
        <img src={welcome} className="w-60 h-60 text-center ml-9" />
        <h1 className="text-center text-gray-100 text-2xl font-bold mb-3">
          Hello, {currentUser.name} !
        </h1>
        <p className="text-lg text-gray-300 text-center">
          Please select a chat to start messaging.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
