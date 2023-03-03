import { useContext, useEffect } from "react";
import {
  SET_CONVERSATION_TYPE,
  SET_CURR_ROOM_ID,
  SET_FRIENDS,
  SET_OPEN_CHAT,
  SET_OPEN_LIST,
  SET_OTHER_ID,
  SET_REQUEST,
} from "../../context/actions";
import { Context } from "../../context/root";
import { socket } from "../../context/socket";
import UsersOffline from "./UsersOffline";
import UsersOnline from "./UsersOnline";

const FriendsList = () => {
  const { state, dispatch } = useContext(Context);

  const handleClick = (id: string) => {
    dispatch({ type: SET_OTHER_ID, payload: id });
    dispatch({ type: SET_CURR_ROOM_ID, payload: "" });
    dispatch({ type: SET_OPEN_CHAT, payload: true });
    dispatch({
      type: SET_CONVERSATION_TYPE,
      payload: "PERSONAL",
    });
    dispatch({ type: SET_OPEN_LIST, payload: !state.openList });
  };

  useEffect(() => {
    socket.on("unfriend", (id: string) => {
      const index = state.friends.indexOf(id)
      state.friends.splice(index, 1)
      dispatch({ type: SET_FRIENDS, payload: [...state.friends]})
    })

    return () => {
      socket.off("unfriend");
    };
  }, []);

  return (
    <>
      <div className="overflow-y-auto flex-1">
        {state.friends.length === 0 ? (
          <p className=" text-gray-500">No friend to show</p>
        ) : (
          <>
            <UsersOnline handleClick={handleClick} />
            <UsersOffline handleClick={handleClick} />
          </>
        )}
      </div>
    </>
  );
};

export default FriendsList;
