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
          {error.length > 0 && <Error message={error} />}
          {errors.email && <Error message={errors.email.message} />}
          {errors.password && <Error message={errors.password.message} />}
          <label className="text-gray-700">Email</label>
          <input
            className="w-full block p-2 mt-1 border-2 mb-3 rounded-lg"
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

          <label className="text-gray-700">Password</label>
          <input
            className="w-full block p-2 mt-1 border-2 mb-3 rounded-lg"
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
            className="border-2 border-[#8d6ff8] py-1 px-2 rounded-lg text-[#8d6ff8] font-semibold hover:bg-[#8d6ff8] hover:text-white hover:duration-500 w-full"
          >
            Sign In
          </button>
          <div className="mt-5 text-gray-600">
            Don{"'"}t you have account{" "}
            <Link to="/signup" className="text-blue-500 font-bold ml-1">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signin;
