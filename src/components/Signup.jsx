import { useSignUpMutation } from "../redux/userServices";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Error from "./helper/Error";
import { saveState } from "../redux/localstorage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [signup] = useSignUpMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      await signup(data)
        .unwrap()
        .then((fulfilled) => {
          const data = fulfilled.data;
          localStorage.removeItem("data");
          saveState(data);
          navigate("/");
        });
    } catch (error) {
      toast.error(error.data.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleSubmit(onSubmit)}>
          {errors.name && <Error message={errors.name.message} />}
          {errors.email && <Error message={errors.email.message} />}
          {errors.password && <Error message={errors.password.message} />}
          <h1 className="text-[#45CFE1] text-center mb-3 text-3xl font-bold">
            Chatty
          </h1>

          <label className="text-gray-300">Name</label>
          <input
            className="w-full block p-2 mt-1 border-2 mb-3 rounded-lg"
            type="text"
            placeholder="name"
            name="name"
            {...register("name", {
              required: {
                value: true,
                message: "Username is required",
              },
            })}
          />

          <label className="text-gray-300">Email</label>
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
          <label className="text-gray-300">Password</label>
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
            className="border-2 border-[#45CFE1] py-1 px-2 rounded-lg text-[#45CFE1] font-semibold hover:bg-[#45CFE1] hover:text-white hover:duration-500 w-full"
          >
            Sign Up
          </button>
          <div className="mt-5 text-gray-300">
            Already have an account{" "}
            <Link to="/signin" className="text-[#45CFE1] font-bold ml-1">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
