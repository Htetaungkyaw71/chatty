import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Protect from "./components/Protext";
import Avatar from "./components/Avatar";
import { io } from "socket.io-client";

function App() {
  const socket = io("http://localhost:5000");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Protect>
              <Home socket={socket} />
            </Protect>
          }
        />
        <Route
          path="/avatar"
          element={
            <Protect>
              <Avatar />
            </Protect>
          }
        />

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
