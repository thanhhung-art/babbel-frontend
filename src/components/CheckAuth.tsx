import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SET_AUTHENCATED,
  SET_CURR_USER_ID,
  SET_FRIENDS,
  SET_REQUEST,
} from "../context/actions";
import { Context } from "../context/root";
import { socket } from "../context/socket";
import { Fetch } from "../utils/fetch";

const CheckAuth = ({ children }: { children: JSX.Element }) => {
  const { state, dispatch } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const localId = localStorage.getItem("chatfun_userId") || sessionStorage.getItem("chatfun_userId")

      if (localId && typeof localId === "string") {
        let userId = localId.split(",")[0];
        let expires = Number(localId.split(",")[1]);

        if (Date.now() < expires) {
          setIsLoading(true)
          let res = await new Fetch("/auth/checkauth", userId).get();
          
          if (res.msg === "authentication success") {
            socket.connect();
            socket.auth = { user: res.data };
            
            dispatch({ type: SET_CURR_USER_ID, payload: userId });
            dispatch({ type: SET_FRIENDS, payload: res.data.friends });
            dispatch({ type: SET_AUTHENCATED, payload: true });
            res.data.friendreq.length > 0 && dispatch({ type: SET_REQUEST, payload: res.data.friendreq });
            setIsLoading(false)
            return;
          }
        }
      }

      setIsLoading(false)
      navigate("/login");
    }

    !state.authencated && checkAuth();
  }, [state.authencated]);

  if (isLoading) return <div>babbel</div>

  return children;
};

export default CheckAuth;
