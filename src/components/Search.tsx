import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo, useRef, useState } from "react";
import { SET_ROOMS, SET_USERS } from "../context/actions";
import { Context } from "../context/root";
import { socket } from "../context/socket";
import { Fetch } from "../utils/fetch";
import PlusIcon from "./icons/PlusIcon";
import VerifiedFriends from "./icons/VerifiedFriends";

const Search = () => {
  const { state, dispatch } = useContext(Context);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchType, setSearchType] = useState("user");
  const [showResult, setShowResult] = useState(false);

  const usersQuery = useQuery<IResultUsersQuery>(
    ["users"],
    () => new Fetch("/user/", state.currUserId).get(),
    {
      onSuccess({ data }) {
        dispatch({ type: SET_USERS, payload: data });
      },
      enabled: state.currUserId.length > 1,
    }
  );

  const roomQuery = useQuery<IResultRoomQuery>(
    ["rooms"],
    () => new Fetch("/room/", state.currUserId).get(),
    {
      onSuccess({ data }) {
        dispatch({ type: SET_ROOMS, payload: data });
      },
      enabled: state.currUserId.length > 1,
    }
  );

  const handleChangeInput = () => {
    if (searchRef.current && searchRef.current.value) {
      setShowResult(true);
    } else setShowResult(false);
  };

  const handleSendRequest = (receiverId: string) => {
    if (searchType === "user") {
      socket.emit("friend_request", receiverId);
    } else {
      socket.emit("join_room_request", receiverId);
    }
    setShowResult(false)
    if (searchRef.current) searchRef.current.value = ""
  };

  const renderSearchData = useMemo(() => (data: { _id: string; name: string }[]) => {
    return data
      .filter((element) => {
        return searchRef.current
          ? element.name.toLowerCase().includes(searchRef.current.value.toLowerCase()) &&
              element._id !== state.currUserId
          : element._id !== state.currUserId;
      })
      .map((element) => (
        <div
          key={element._id}
          className="flex border items-center shadow-sm p-2"
        >
          <p className="flex-1">{element.name}</p>
          <button className="rounded-full h-5 w-5 flex justify-center items-center cursor-pointer">
            {searchType === "user" ? (
              state.friends?.includes(element._id) ? (
                <div><VerifiedFriends w={15} h={15} /></div>
              ) : (
                <span
                  className="border rounded-full active:bg-gray-200"
                  onClick={() => handleSendRequest(element._id)}
                >
                  <PlusIcon />
                </span>
              )
            ) : state.user?.roomJoined.includes(element._id) ? (
              <span className="font-bold"><VerifiedFriends w={15} h={15} /></span>
            ) : (
              <span
                className="font-bold"
                onClick={() => handleSendRequest(element._id)}
              >
                <PlusIcon />
              </span>
            )}
          </button>
        </div>
      ));
  }, [usersQuery.data, roomQuery.data, searchType]);

  return (
    <div className="mb-4">
      <div className="relative">
        <div className="flex border border-gray-400 rounded-full">
          <input
            ref={searchRef}
            onChange={handleChangeInput}
            placeholder="search..."
            type="text"
            className="outline-none py-1 px-2 w-full rounded-full"
          />
          <select
            name="type"
            id="type"
            onChange={(e) => setSearchType(e.target.value)}
            className="bg-gray-100 px-1 text-sm outline-none rounded-r-full"
          >
            <option value="user">user</option>
            <option value="room">room</option>
          </select>
        </div>
        {showResult && searchRef.current?.value && (
          <div className="absolute top-full left-0 right-0 shadow-md bg-white z-10">
            {searchType === "user"
              ? usersQuery.data && renderSearchData(usersQuery.data.data)
              : roomQuery.data && renderSearchData(roomQuery.data.data)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
