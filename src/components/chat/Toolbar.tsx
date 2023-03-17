import {
  lazy,
  Suspense,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
} from "react";
import {
  SET_CONTAINERS,
  SET_OPEN_CHAT,
  SET_ROOMS,
} from "../../context/actions";
import { Context } from "../../context/root";
import { socket } from "../../context/socket";
import SettingIcon from "../../public/icons/setting-tool-svgrepo-com.svg";
import RoomIcon from "../icons/RoomIcon";
import UserPlaceholder from "../icons/UserPlaceholder";
const RoomRequest = lazy(() => import("../tools/RoomRequest"));
const SettingsRoom = lazy(() => import("../tools/SettingRoom"));
const Members = lazy(() => import("../Rooms/Members"));

interface IProps {
  setConversation: Dispatch<SetStateAction<Message[]>>;
  isFetchingMessage: true | false;
}

const Toolbar = ({ setConversation, isFetchingMessage }: IProps) => {
  const { state, dispatch } = useContext(Context);
  const [requestJoinRoom, setRoomRequest] = useState<string[]>([]);

  const getOtherUser = () =>
    state.users.find((user) => user._id === state.otherId);
  const getRoom = () =>
    state.rooms.find((room) => room._id === state.currRoomId);

  const handleLeaveRoom = useCallback(() => {
    const time = `${Date.now()}`;
    const message = {
      userId: state.currUserId,
      message: "has left the room",
      time,
      likes: [],
    };
    socket.emit("leave_room", state.currRoomId, message);
    const index = state.rooms.findIndex(
      (room) => room._id === state.currRoomId
    );
    const idxInMember = state.rooms[index].members.indexOf(state.currUserId);
    state.rooms[index].members.splice(idxInMember, 1);
    dispatch({ type: SET_ROOMS, payload: [...state.rooms] });
    dispatch({ type: SET_OPEN_CHAT, payload: false });
  }, [state.rooms.length, state.isOpenChat, state.currUserId]);

  useEffect(() => {
    socket.on("join_room_request", (userId: string, roomId: string) => {
      if (!requestJoinRoom.includes(userId))
        setRoomRequest([...requestJoinRoom, userId]);
    });

    return () => {
      socket.off("join_room_request")
    }
  }, [requestJoinRoom.length]);

  useEffect(() => {
    if (state.rooms.length > 0) {
      socket.on(
        "someone_join_room",
        (
          roomId: string,
          message: {
            userId: string;
            message: string;
            time: string;
            likes: string[];
          }
        ) => {
          const index = state.rooms.findIndex((room) => room._id === roomId);
          if (index !== -1) {
            setRoomRequest(state.rooms[index].joinRequest);
            setConversation((conversation) => [...conversation, message]);
          }
        }
      );
    }

    return () => {
      socket.off("someone_join_room")
    }
  }, [state.rooms.length]);

  useEffect(() => {
    const requestJoinRoom = state.rooms.find(
      (room) => room._id === state.currRoomId
    )?.joinRequest;

    if (requestJoinRoom && requestJoinRoom.length > 0)
      setRoomRequest(requestJoinRoom);
  }, [state.rooms.length]);

  return (
    <div className="flex items-center p-2 border-b z-1 relative">
      {isFetchingMessage && (
        <div className="absolute top-full left-0 right-0 flex justify-center pt-1">
          <div className="border-4 border-t-blue-500 border-b-blue-600 border-l-blue-600 rounded-full w-6 h-6 animate-spin"></div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <div
          className={`h-8 w-8 rounded-full ${
            state.otherId && "bg-gray-300 "
          } flex justify-center items-center`}
        >
          {state.otherId ? (
            getOtherUser()?.avatar ? (
              <img
                src={getOtherUser()?.avatar}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <UserPlaceholder />
            )
          ) : getRoom()?.avatar ? (
            <img
              src={getRoom()?.avatar}
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <RoomIcon />
          )}
        </div>
        {state.otherId ? (
          <p className="text-sm font-bold">{getOtherUser()?.name}</p>
        ) : (
          <p className="text-sm font-bold">{getRoom()?.name}</p>
        )}
      </div>
      {state.currRoomId && getRoom()?.roomMasterId === state.currUserId && (
        <div className="relative ml-4 boxContainer">
          <h4 className="text-sm font-bold cursor-pointer">
            request
            {requestJoinRoom.length > 0 && (
              <span className="absolute top-0 left-full bg-blue-500 text-white text-ssm font-light w-3 h-3 flex justify-center items-center rounded-full">
                {requestJoinRoom.length}
              </span>
            )}
          </h4>
          <div style={{ display: "none" }}>
            <Suspense>
              <RoomRequest
                requestJoinRoom={requestJoinRoom}
                setRequestJoinRoom={setRoomRequest}
                setConversation={setConversation}
              />
            </Suspense>
          </div>
        </div>
      )}
      {state.currRoomId && (
        <div className="ml-4 relative boxContainer">
          <button className="text-sm font-bold">members</button>
          <div style={{ display: "none" }}>
            <Suspense>
              <Members />
            </Suspense>
          </div>
        </div>
      )}
      <div className="flex-1"></div>
      {state.currRoomId && state.currUserId === getRoom()?.roomMasterId ? (
        <div>
          <div className="cursor-pointer relative boxContainer">
            <img
              src={SettingIcon}
              alt="settings"
              className="h-5 w-5 rounded-full object-cover"
            />
            <div style={{ display: "none" }}>
              <Suspense>
                <SettingsRoom />
              </Suspense>
            </div>
          </div>
        </div>
      ) : (
        state.currRoomId && (
          <div>
            <button
              className="text-sm bg-red-500 hover:bg-red-600 active:bg-red-700 text-white p-1 rounded shadow"
              onClick={handleLeaveRoom}
            >
              leave room
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Toolbar;
