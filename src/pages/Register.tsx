import { useMutation } from "@tanstack/react-query";
import { FormEvent, useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SET_AUTHENCATED, SET_CURR_USER_ID } from "../context/actions";
import { Context } from "../context/root";
import { socket } from "../context/socket";
import { Fetch } from "../utils/fetch";

const Register = () => {
  const { dispatch } = useContext(Context)
  const email = useRef<HTMLInputElement>(null);
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const passwordAgain = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    passwordAgain: "",
  });

  const register = useMutation((data: {
    email: string;
    name: string;
    password: string;
  }) => {
    return new Fetch(`/auth/register`, "", data).post();
  }, {
    onSuccess({ msg, data }) {
      if (msg == 'user register successfully') {
        socket.connect()
        socket.auth = { user: data }
        dispatch({ type: SET_AUTHENCATED, payload: true})
        dispatch({ type: SET_CURR_USER_ID, payload: data._id })
        navigate('/')
      }
    }
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      email.current &&
      username.current &&
      password.current &&
      passwordAgain.current
    ) {
      if (email.current.value === "") {
        setErrors({ ...errors, email: "email can't empty" });
      } else if (username.current.value === "") {
        setErrors({ ...errors, username: "username can't not empty" });
      } else if (password.current.value === "") {
        setErrors({ ...errors, password: "password can't empty" });
      } else if (passwordAgain.current.value !== password.current.value) {
        setErrors({ ...errors, passwordAgain: "password don't match" });
      } else {
        register.mutate({
          email: email.current.value,
          name: username.current.value,
          password: password.current.value,
        });
      }
    }
  };

  const handleResetErrors = () => {
    setErrors({
      email: "",
      username: "",
      password: "",
      passwordAgain: "",
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-xs">
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4 text-center">
            Register with email
          </h2>
          <form
            className="w-full border shadow-lg p-8 rounded-lg flex flex-col gap-5"
            onSubmit={onSubmit}
          >
            <div className="flex flex-col">
              <input
                ref={email}
                type="email"
                id="register-email"
                placeholder="type your email"
                className="p-2 border border-gray-400 outline-none text-sm rounded-md"
                onClick={handleResetErrors}
              />
              {errors.email && (
                <label
                  htmlFor="register-email"
                  className="text-sm text-red-500"
                >
                  {errors.email}
                </label>
              )}
            </div>
            <div className="flex flex-col">
              <input
                ref={username}
                type="text"
                id="regiter-username"
                placeholder="type your username"
                className="p-2 border border-gray-400 outline-none text-sm rounded-md"
                onClick={handleResetErrors}
              />
              {errors.username && (
                <label
                  htmlFor="register-username"
                  className="text-sm text-red-500"
                >
                  {errors.username}
                </label>
              )}
            </div>
            <div className="flex flex-col">
              <input
                ref={password}
                type="password"
                id="register-password"
                placeholder="type your password"
                className="p-2 border border-gray-400 outline-none text-sm rounded-md"
                onClick={handleResetErrors}
              />
              {errors.password && (
                <label
                  htmlFor="register-password"
                  className="text-sm text-red-500"
                >
                  {errors.password}
                </label>
              )}
            </div>
            <div className="flex flex-col">
              <input
                ref={passwordAgain}
                type="password"
                id="register-password-again"
                placeholder="type your password again"
                className="p-2 border border-gray-400 outline-none text-sm rounded-md"
                onClick={handleResetErrors}
              />
              {errors.passwordAgain && (
                <label
                  htmlFor="register-password-again"
                  className="text-sm text-red-500"
                >
                  {errors.passwordAgain}
                </label>
              )}
            </div>
            <button
              ref={button}
              type="submit"
              className="p-2 w-full bg-blue-700 shadow-md text-white rounded-md"
            >
              register
            </button>
            <p className="text-sm">You have an account already? <Link to='/login' className="text-blue-600">login</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
