import { Dispatch, SetStateAction, useContext } from "react";
import { Context } from "../../context/root";
import { socket } from "../../context/socket";
import Avatar from "../Avatar";

interface IProps {
  requestJoinRoom: string[];
  setRequestJoinRoom: Dispatch<SetStateAction<string[]>>;
  setConversation: Dispatch<SetStateAction<Message[]>>;
}

const RoomRequest = ({
  requestJoinRoom,
  setRequestJoinRoom,
  setConversation,
}: IProps) => {
  const { state } = useContext(Context);

  const getUserById = (id: string) =>
    state.users.find((user) => user._id === id);

  const acceptRequestJoinRoom = (userId: string) => {
    const time = `${Date.now()}`;
    const message = {
      userId,
      message:'has joined the room',
      time,
      likes: []
    };
    socket.emit("accept_join_room_request", {
      roomId: state.currRoomId,
      userId,
      message,
    });

    const index = requestJoinRoom.indexOf(userId);
    requestJoinRoom.splice(index, 1);
    setRequestJoinRoom([...requestJoinRoom]);
  };
  const declineRequestJoinRoom = (userId: string) => {
    socket.emit("decline_join_room_request", {
      userId,
      roomId: state.currRoomId,
    });

    const index = requestJoinRoom.indexOf(userId);
    requestJoinRoom.splice(index, 1);
    setRequestJoinRoom([...requestJoinRoom]);
  };

  if (requestJoinRoom.length === 0) {
    return (
      <div className="absolute border shadow-md top-full left-0 w-24 bg-white rounded-md z-10">
        <p className="text-sm p-2">no request to show</p>
      </div>
    );
  }

  return (
    <div className="absolute border shadow-md top-full left-0 bg-white p-2 rounded-md z-10">
      {requestJoinRoom.map((userId) => {
        const user = getUserById(userId);
        return (
          <div key={userId} className="flex items-center gap-2 mt-2">
            <Avatar src={user?.avatar || ""} />
            <p className="text-sm w-12">
              {user && user.name.length < 12
                ? user.name
                : user?.name.slice(0, 12)}
            </p>
            <button
              className="rounded-full bg-green-500 hover:bg-green-600 active:bg-green-700 shadow text-white text-sm h-6 w-12 flex items-center justify-center"
              onClick={() => acceptRequestJoinRoom(userId)}
            >
              &#10003;
            </button>
            <button
              className="rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 shadow text-white text-sm h-6 w-12 flex items-center justify-center"
              onClick={() => declineRequestJoinRoom(userId)}
            >
              &#10005;
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default RoomRequest;
