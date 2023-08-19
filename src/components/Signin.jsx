import { useState } from "react";
import { useSignInMutation } from "../redux/userServices";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Error from "./helper/Error";
import { saveState } from "../redux/localstorage";

const Signin = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [signin] = useSignInMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    try {
      await signin(data)
        .unwrap()
        .then((fulfilled) => {
          const data = fulfilled.data;
          console.log(data);
          localStorage.removeItem("data");
          saveState(data);
          setError("");
          navigate("/");
        });
    } catch (error) {
      console.log(error);
      setError(error.data.message);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-[#45CFE1] text-center mb-3 text-3xl font-bold">
            Chatty
          </h1>
          {error.length > 0 && <Error message={error} />}
          {errors.email && <Error message={errors.email.message} />}
          {errors.password && <Error message={errors.password.message} />}
          <label className="text-gray-300">Email</label>
          <input
            className="w-full block p-2 mt-1 border-2 mb-3 rounded-lg  outline-[#45CFE1]"
            type="text"
            placeholder="email"
            name="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Please enter a valid email",
              },
            })}
          />

          <label className="text-gray-300">Password</label>
          <input
            className="w-full block p-2 mt-1 border-2 mb-3 rounded-lg  outline-[#45CFE1]"
            type="password"
            placeholder="password"
            name="password"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
            })}
          />

          <button
            type="submit"
            className="border-2 mt-2 border-[#45CFE1] py-1 px-2 rounded-lg text-[#45CFE1] font-semibold hover:bg-[#45CFE1] hover:text-white hover:duration-500 w-full"
          >
            Sign In
          </button>
          <div className="mt-5 text-gray-300">
            Don{"'"}t you have account{" "}
            <Link to="/signup" className="text-[#45CFE1] font-bold ml-1">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signin;
