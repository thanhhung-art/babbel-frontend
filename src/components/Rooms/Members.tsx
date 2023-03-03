import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../context/root";
import { socket } from "../../context/socket";
import Avatar from "../Avatar";

const Members = () => {
  const { state } = useContext(Context);
  const [members, setMembers] = useState<string[]>([]);
  const roomMasterId = useRef("");

  const getUser = (userId: string) =>
    state.users.find((user) => user._id === userId);

  const handlePushTheUserOutOfTheRoom = (userId: string) => {
    socket.emit('push_the_user_out_of_the_room', state.currRoomId, userId)

    members.splice(members.indexOf(userId), 1)
    setMembers([...members])
  }

  useEffect(() => {
    if (state.rooms.length > 0) {
      const room = state.rooms.find((room) => room._id === state.currRoomId);
      if (room) {
        setMembers(room.members);
        roomMasterId.current = room.roomMasterId;
      }
    }
  }, [state.rooms.length]);

  return (
    <div className="absolute top-full left-0 bg-white p-1 shadow rounded z-10">
      {members
        .sort((currUser, nextUser) => {
          if (state.usersOnline.find((user) => user.id === currUser)) return -1;
          return 1;
        })
        .map((userId) => {
          const user = getUser(userId);
          if (user?._id === state.currUserId) return <Fragment key={userId}></Fragment>
          const isOnline = state.usersOnline.find((user) => user.id === userId)
            ? true
            : false;
          return (
            <div
              key={userId}
              className="flex gap-2 items-center hover:bg-gray-200 my-1 p-1 rounded"
            >
              <Avatar src={(user && user.avatar) || ""} h={5} w={5} />
              <div className="min-w-5 max-h-40 overflow-auto">
                <p className="relative text-sm pr-2 w-fit">
                  {user?.name}
                  {isOnline && (
                    <span className="w-2 h-2 bg-green-500 rounded-full absolute top-0 right-0"></span>
                  )}
                </p>
              </div>
              {roomMasterId.current === state.currUserId && (
                <button 
                  className="text-sm bg-red-500 text-white rounded"
                  onMouseDown={() => handlePushTheUserOutOfTheRoom(userId)}
                >
                  kick
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Members;
