/* eslint-disable react/prop-types */

const Contact = ({ contact }) => {
  return (
    <div className="mt-3 p-3 w-64 rounded-xl hover:bg-[#171E3A]">
      <div className="flex gap-3 items-center">
        <img
          src={`data:image/svg+xml;base64,${contact.otherUserAvater}`}
          className="rounded-xl w-10 h-10"
        />
        <div>
          <h1 className="text-left">{contact.otherUserName}</h1>
          <h1 className="text-gray-400">{contact.otherUserEmail}</h1>
        </div>
      </div>
    </div>
  );
};

export default Contact;
