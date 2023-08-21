/* eslint-disable react/prop-types */
import Addcontact from "./Addcontact";

const Results = ({ user, refetch }) => {
  return (
    <div
      key={user.id}
      className="bg-[#171E3A] w-64 mt-4 p-3 rounded-xl flex justify-between items-center"
    >
      <div className="flex gap-2">
        <img
          src={`data:image/svg+xml;base64,${user.avater}`}
          className="rounded-xl w-10 h-10"
        />
        <div>
          <h1>{user.name}</h1>
          <h1 className="text-gray-400">{user.email}</h1>
        </div>
      </div>

      <div>
        <Addcontact user={user} refetch={refetch} />
      </div>
    </div>
  );
};

export default Results;
