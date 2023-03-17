import { useMutation } from "@tanstack/react-query";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import {
  SET_CONVERSATION_TYPE,
  SET_CURR_ROOM_ID,
  SET_OPEN_CHAT,
  SET_OPEN_LIST,
  SET_OTHER_ID,
  SET_ROOMS,
  SET_USERS,
} from "../../context/actions";
import { Context } from "../../context/root";
import { socket } from "../../context/socket";
import { Fetch } from "../../utils/fetch";
import Item from "./Item";

const Rooms = () => {
  const { state, dispatch } = useContext(Context);
  const [name, setName] = useState("");
  const [openCreateRoomBtn, setOpenCreateRoomBtn] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const [roomJoined, setRoomJoined] = useState<Room[]>([]);
  const prevRoomId = useRef("");

  const createRoom = useMutation(
    (data: { name: string }) =>
      new Fetch(
        `/room/create/${state.currUserId}`,
        state.currUserId,
        data
      ).post(),
    {
      onSuccess({ data }: { data: Room }) {
        dispatch({ type: SET_ROOMS, payload: [...state.rooms, data] });
        setRoomJoined([...roomJoined, data]);
      },
    }
  );

  const handleOpenCreateRoom = () => setOpenCreateRoomBtn(!openCreateRoomBtn);
  const handleCreateRoom = () => {
    if (name) createRoom.mutate({ name });
  };

  const handleClickRoom = (roomId: string) => {
    prevRoomId.current = state.currRoomId;
    socket.emit("join_room", roomId, prevRoomId);
    dispatch({ type: SET_CONVERSATION_TYPE, payload: "ROOM" });
    dispatch({ type: SET_CURR_ROOM_ID, payload: roomId });
    dispatch({ type: SET_OPEN_CHAT, payload: true });
    dispatch({ type: SET_OTHER_ID, payload: "" });
    dispatch({ type: SET_OPEN_LIST, payload: !state.openList });
  };

  useEffect(() => {
    const temp = state.rooms.filter((room) =>
      room.members.includes(state.currUserId)
    );
    setRoomJoined(temp);
  }, [state.rooms]);

  useEffect(() => {
    socket.on("accept_join_room_request", (roomId: string) => {
      const room = state.rooms.find((room) => room._id === roomId);
      if (room) {
        setRoomJoined((roomJoined) => [...roomJoined, room]);
      }
    });

    return () => {
      socket.off("accept_join_room_request")
    }
  }, []);

  useEffect(() => {
    if (state.rooms.length > 0) {
      socket.on(
        "push_the_user_out_of_the_room",
        (roomId: string, userId: string) => {
          const roomIndex = state.rooms.findIndex(
            (room) => room._id === roomId
          );
          state.rooms[roomIndex].members.splice(
            state.rooms[roomIndex].members.indexOf(userId),
            1
          );
          dispatch({ type: SET_ROOMS, payload: [...state.rooms] });
        }
      );
    }

    return () => {
      socket.off("push_the_user_out_of_the_room")
    }
  }, [state.rooms.length]);

  return (
    <>
      <div className="overflow-y-auto">
        <div className="flex justify-between items-center">
          <div className="">
            <button
              className="p-1 bg-blue-500 text-white rounded-md text-sm"
              onClick={handleOpenCreateRoom}
            >
              create room
            </button>
          </div>
        </div>
        {openCreateRoomBtn && (
          <div className="flex mt-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="border shadow-sm outline-none w-full p-1"
            />
            <button
              className="bg-blue-500 text-white p-1 rounded-md text-sm"
              onClick={() => {
                handleOpenCreateRoom();
                if (nameRef.current) nameRef.current.value = "";
                handleCreateRoom();
              }}
            >
              create
            </button>
          </div>
        )}
        <div className="pt-1 overflow-y-auto">
          {roomJoined.map((room) => (
            <Fragment key={room._id}>
              <Item
                _id={room._id}
                handleClick={handleClickRoom}
                avatar={room.avatar}
                name={room.name}
                type="room"
              />
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default Rooms;
