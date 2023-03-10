import React, {
  MouseEventHandler,
  MouseEvent,
  useContext,
  useRef,
  useState,
  useEffect
} from "react";
import {
  SET_AUTHENCATED,
  SET_CURR_USER_ID,
  SET_FRIENDS,
  SET_REQUEST,
} from "../context/actions";
import { Context } from "../context/root";
import { useMutation } from "@tanstack/react-query";
import { Fetch } from "../utils/fetch";
import { Link, useNavigate } from "react-router-dom";
import { socket } from "../context/socket";
import { useGoogleLogin } from '@react-oauth/google'
import CryptoJS from "crypto-js";

const pass_secret = import.meta.env.VITE_PASS_SECRET;

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useContext(Context);
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  let navigate = useNavigate();

  const mutationLogin = useMutation(
    (data: UserLogin) => {
      return new Fetch(`/auth/login`, "", data).post();
    },
    {
      onSuccess({ msg, data }) {
        if (msg === "query success") {
          socket.connect();
          socket.auth = { user: data };
          if (checkboxRef.current?.checked) {
            localStorage.setItem(
              "chatfun_userId",
              `${data._id},${Date.now() + 1000 * 60 * 60 * 24 * 7}`
            );
          } else {
            sessionStorage.setItem(
              "chatfun_userId",
              `${data._id},${Date.now() + 1000 * 60 * 60 * 24 * 7}`
            );
          }

          dispatch({ type: SET_CURR_USER_ID, payload: data._id });
          dispatch({ type: SET_AUTHENCATED, payload: true });
          dispatch({ type: SET_FRIENDS, payload: data.friends });
          data.friendreq.length > 0 &&
            dispatch({ type: SET_REQUEST, payload: data.friendreq });
          navigate("/");
        } else {
          if (msg === "user not found") {
            setError({ ...error, email: "email not found" });
          } else {
            setError({ ...error, password: "invalid password" });
          }
        }
      },
    }
  );

  const fetchDataFromGoogle = async (token: string, tokenType: string) => {
    try {
      const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
        headers: {
          Authorization: `${tokenType} ${token}`,
          Accept: 'application/json'
        }
      })

      const data: Promise<IUserFromGG> = res.json()
      const { email, picture, name, id } = await data;
      mutationLogin.mutate({ email, picture, ggId: id, name })
    } catch (error) {
      console.log(error);
    }
  }

  const handleAuthencation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailRef.current && passwordRef.current) {
      mutationLogin.mutate({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      if (!error.email && !error.password) {
        emailRef.current.value = "";
        passwordRef.current.value = "";
      }
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess (res) {
      fetchDataFromGoogle(res.access_token, res.token_type)
    },
    onError( res ) {
      console.log(error);
    }
  })

  const handleLoginWithGoogle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    googleLogin()
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-xs w-full">
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4 text-center">
            Login with email
          </h2>
          <form
            onSubmit={handleAuthencation}
            className="flex flex-col gap-2 p-8 border shadow-lg rounded"
          >
            <div>
              <input
                ref={emailRef}
                type="email"
                placeholder="email"
                className="border border-gray-400 p-2 outline-none w-full rounded-md"
                id="email"
                onClick={() => setError({ email: "", password: "" })}
              />
              {error.email && (
                <label htmlFor="email" className="text-sm text-red-500">
                  {error.email}
                </label>
              )}
            </div>
            <div>
              <input
                ref={passwordRef}
                type="password"
                placeholder="password"
                className="border p-2 outline-none w-full rounded-md border-gray-400"
                id="password"
                onClick={() => setError({ email: "", password: "" })}
              />
              {error.password && (
                <label htmlFor="password" className="text-sm text-red-500">
                  {error.password}
                </label>
              )}
            </div>
            <div>
              <input
                type="checkbox"
                ref={checkboxRef}
                id="remember_user"
                className="cursor-pointer"
              />
              <label
                htmlFor="remember_user"
                className="text-sm ml-2 text-gray-500"
              >
                save on this browser
              </label>
            </div>
            <button
              type="submit"
              className="border-2 p-2 rounded-md bg-blue-600 text-white text-sm"
            >
              Login
            </button>
            <p className="text-center text-sm">or</p>
            <div>
              <button
                className="border-2 p-2 text-sm rounded-md w-full bg-red-600 text-white"
                onClick={handleLoginWithGoogle}
              >
                Login with google
              </button>
            </div>
            <p className="text-sm">
              Don't have an acount?{" "}
              <Link to="/register" className="text-blue-700 cursor-pointer">
                register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
