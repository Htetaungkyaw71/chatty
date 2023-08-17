/* eslint-disable react/prop-types */
const Error = ({ message }) => {
  return (
    <div
      id="alert-2"
      className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
      role="alert"
    >
      <span className="sr-only">Info</span>
      <div className="ml-3 text-sm font-medium">{message}</div>
    </div>
  );
};

export default Error;
