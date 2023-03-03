import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { Context } from "../../context/root";
import FriendsList from "./FriendsList";
import Search from "../Search";
import { useQuery } from "@tanstack/react-query";
import { Fetch } from "../../utils/fetch";
import { socket } from "../../context/socket";
import { SET_FRIENDS } from "../../context/actions";
const Rooms = lazy(() => import("./Rooms"));
const Request = lazy(() => import ("./Request"));

const Lists = () => {
  const { state, dispatch } = useContext(Context);
  const [currDisplay, setCurrDisplay] = useState<
    "friends" | "rooms" | "request"
  >("friends");
  const [underscoreP, setUnderscoreP] = useState<
    "" | "translate-x-1/2 right-1/2" | "right-0"
  >("");
  const [request, setRequest] = useState<string[]>([]);

  const friendReqQuery = useQuery<IResultFriendReqQuery>(
    ["getFriendReq"],
    () =>
      new Fetch(
        `/user/get_friend_req/${state.currUserId}`,
        state.currUserId
      ).get(),
    {
      onSuccess({ msg, data }) {
        if (msg === "success") setRequest(data);
      },
      enabled: state.currUserId.length > 1,
    }
  );

  const handlePositionOfUnderscore = (p: number) => {
    if (p === 0) {
      setUnderscoreP("");
      setCurrDisplay("friends");
    } else if (p === 50) {
      setUnderscoreP("translate-x-1/2 right-1/2");
      setCurrDisplay("rooms");
    } else {
      setUnderscoreP("right-0");
      setCurrDisplay("request");
    }
  };

  useEffect(() => {
    socket.on("friend_request", (senderId: string) => {
      setRequest([...request, senderId]);
    });

    socket.on("accept_friend_request", (senderId: string) => {
      dispatch({ type: SET_FRIENDS, payload: [...state.friends, senderId] });
    });

    socket.on("decline_friend_request", (senderId: string) => {
      console.log("decline request");
    });
  }, []);

  return (
    <div
      className={`p-4 bg-white w-full absolute sm:static z-30 border-r border-r-gray-300 shadow top-0 bottom-0 ${
        state.openList && "right-full"
      } min-w-250 sm:static flex flex-col sm:w-1/4 transition`}
    >
      <Search />
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <div className="flex justify-between pb-1 relative">
            <div className="flex justify-center items-center w-20">
              <h2
                onClick={() => handlePositionOfUnderscore(0)}
                className="  text-sm cursor-pointer"
              >
                Friends list
              </h2>
            </div>
            <div className="flex justify-center items-center w-20">
              <h2
                onClick={() => handlePositionOfUnderscore(50)}
                className=" text-sm cursor-pointer"
              >
                Rooms
              </h2>
            </div>
            <div className="flex justify-center items-center w-20">
              <h2
                onClick={() => handlePositionOfUnderscore(100)}
                className="text-sm cursor-pointer relative pt-1"
              >
                Request
                {request.length > 0 && (
                  <span className="absolute top-0 left-full w-4 h-4 bg-blue-500 rounded-full text-white text-ssm flex justify-center items-center">
                    1
                  </span>
                )}
              </h2>
            </div>
            <div
              className={`absolute transition-all top-full ${underscoreP} w-20 h-1 bg-blue-500 rounded`}
            ></div>
          </div>
        </div>
        {currDisplay === "friends" && <FriendsList />}
        {currDisplay === "rooms" && (
          <Suspense>
            <Rooms />
          </Suspense>
        )}
        {currDisplay === "request" && (
          <Suspense>
            <Request request={request} setRequest={setRequest} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Lists;
