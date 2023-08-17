/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { loadState } from "../redux/localstorage";

const hasJWT = () => {
  const data = loadState();
  if (data) {
    return true;
  }
  return false;
};

function Protect({ children }) {
  if (!hasJWT()) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

export default Protect;
