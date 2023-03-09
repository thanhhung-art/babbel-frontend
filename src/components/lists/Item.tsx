import Avatar from "../Avatar";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/root";
import MoreIcon from "../icons/MoreIcon";
import { socket } from "../../context/socket";
import { SET_FRIENDS, SET_ROOMS } from "../../context/actions";
import handleName from "../../utils/handleName";

interface IProps {
  _id: string;
  handleClick: Function;
  avatar: string;
  name: string;
  type: "user" | "room";
}

const Item = ({ _id, handleClick, avatar, name, type }: IProps) => {
  const { state, dispatch } = useContext(Context);
  const [openOptions, setOpenOptions] = useState(false);
  const [isYourRoom, setIsYourRoom] = useState(false);

  const handleOpenOptions = () => setOpenOptions(!openOptions);
  const handleCloseOptionsBtn = () => setOpenOptions(false);
  const handleUnfriend = () => {
    socket.emit("unfriend", { sender: state.currUserId, receiver: _id });

    const index = state.friends.indexOf(_id);
    state.friends.splice(index, 1);
    dispatch({ type: SET_FRIENDS, payload: [...state.friends] });
  };
  const handleLeaveRoom = () => {
    const message = {
      userId: state.currUserId,
      message: `${
        state.users.find((user) => user._id === state.currUserId)?.name
      } has left the room`,
      time: `${Date.now()}`,
    };
    socket.emit("leave_room", _id, message);
    const index = state.rooms.findIndex((room) => room._id === _id);
    const idxInMember = state.rooms[index].members.indexOf(state.currUserId);
    state.rooms[index].members.splice(idxInMember, 1);
    dispatch({ type: SET_ROOMS, payload: [...state.rooms] });
  };
  const handleDeleteRoom = () => {
    socket.emit("delete_room", _id);
    const index = state.rooms.findIndex((room) => room._id === _id);
    state.rooms.splice(index, 1);
    dispatch({ type: SET_ROOMS, payload: [...state.rooms] });
  };

  useEffect(() => {
    if (type === "room") {
      const room = state.rooms.find((room) => room._id === _id);
      if (room && room.roomMasterId === state.currUserId) {
        setIsYourRoom(true);
      }
    }
  }, [state.rooms.length]);

  return (
    <div className="p-2 cursor-pointer flex gap-2 items-center hover:bg-gray-100 rounded-md">
      <div onClick={() => handleClick(_id)}>
        <Avatar src={avatar} type={type} />
      </div>
      <div className="flex-1" onClick={() => handleClick(_id)} title={name}>
        <p className="text-sm relative w-max">
          {handleName(name, type)}
          <span
            className={`absolute w-2 h-2 rounded-full ${
              state.usersOnline.find((u) => u.id === _id)
                ? "bg-green-500"
                : "bg-transparent"
            } top-1 -right-2`}
          ></span>
        </p>
      </div>
      <div className="relative">
        {type === 'user' && (
          <button onClick={handleOpenOptions} onBlur={handleCloseOptionsBtn}>
            <MoreIcon w={30} h={30} />
          </button>
        )}
        {openOptions && (
          <div className="absolute top-0 right-full p-1 bg-gray-200">
            {type === "user" ? (
              <>
                <button
                  onMouseDown={handleUnfriend}
                  className="text-sm border bg-gray-200 hover:bg-gray-300 active:bg-gray-600  text-gray-700 p-1 rounded-lg shadow-sm w-full"
                >
                  unfriend
                </button>
                {/* <button className="text-sm border bg-gray-200 hover:bg-gray-300 active:bg-gray-600 text-gray-600 p-1 rounded-lg shadow-sm w-full">
                  block
                </button> */}
              </>
            ) : isYourRoom ? (
              <button
                onMouseDown={handleDeleteRoom}
                className="text-sm border bg-gray-200 hover:bg-gray-300 active:bg-gray-600 text-gray-600 p-1 rounded-lg shadow-sm w-full min-w-max"
              >
                delete room
              </button>
            ) : (
              <button
                onMouseDown={handleLeaveRoom}
                className="text-sm border bg-gray-200 hover:bg-gray-300 active:bg-gray-600 text-gray-600 p-1 rounded-lg shadow-sm w-full min-w-max"
              >
                leave room
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
