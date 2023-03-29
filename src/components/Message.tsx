import {
  Dispatch,
  useMemo,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Context } from "../context/root";
import { socket } from "../context/socket";
import Avatar from "./Avatar";
import CryptoJS from "crypto-js";
import DeleteIcon from "./icons/DeleteIcon";
import LikeIcon from "./icons/LikeIcon";
import { Time } from "../utils/time";

const pass_secret = import.meta.env.VITE_PASS_SECRET;

const Message = ({
  content,
  setConversation,
  currConversationId,
}: {
  content: Message;
  setConversation: Dispatch<SetStateAction<Message[]>>;
  currConversationId: string;
}) => {
  const { state } = useContext(Context);
  const [openDeleteBtn, setOpenDeleteBtn] = useState(false);
  const [liked, setLiked] = useState(false);
  const [messageDecrypt, setMessageDecrypt] = useState("");
  const isCurrUser = state.currUserId === content.userId;
  const isNotification: boolean = useMemo(
    () =>
      content.message.endsWith("has joined the room") ||
      content.message.endsWith("has left the room"),
    []
  );
  let isRoomMaster = false;
  const imageRef = useRef<HTMLImageElement>(null);

  if (state.currRoomId) {
    const roomMasterId = state.rooms.find(
      (room) => room._id === state.currRoomId
    )?.roomMasterId;
    if (roomMasterId) isRoomMaster = roomMasterId === state.currUserId;
  }

  const handleOpenDeleteBtn = useCallback(
    () => setOpenDeleteBtn(!openDeleteBtn),
    [openDeleteBtn]
  );
  
  const handleDeleteMessage = () => {
    if (state.otherId) {
      socket.emit("delete_personal_message", {
        id: content._id || "",
        time: content.time,
        receiverId: state.otherId,
      });

      setConversation((conversation) => {
        if (content._id) {
          const index = conversation.findIndex(
            (mess) => mess._id === content._id
          );
          conversation.splice(index, 1);
          return [...conversation];
        }

        const index = conversation.findIndex(
          (mess) => mess.time === content.time
        );
        conversation.splice(index, 1);
        return [...conversation];
      });
    } else {
      socket.emit("delete_room_message", {
        id: content._id || "",
        time: content.time,
        roomId: state.currRoomId,
      });
    }
  }

  const handleLikeMessage = () => {
    if (!liked)
      socket.emit(
        "like_message",
        currConversationId,
        state.currUserId,
        content._id || content.time,
        state.otherId
      );
    else
      socket.emit(
        "dont_like_message",
        currConversationId,
        state.currUserId,
        content._id,
        state.otherId
      );
      
    setLiked(!liked);
  }

  const handleMessage = useCallback((): string => {
    if (isNotification) {
      return getUser()?.name + " " + content.message;
    }
    // message no encrypt
    if (content.message.includes(" ") || content.message.length < 20) {
      return content.message;
    }
    return CryptoJS.AES.decrypt(content.message, pass_secret).toString(
      CryptoJS.enc.Utf8
    );
  }, []);

  const getUser = useCallback(
    () => state.users.find((user) => user._id === content.userId),
    [state.users.length]
  );
  const messageColor = useMemo<string>(
    () =>
      isNotification
        ? "bg-emerald-400 text-white"
        : isCurrUser
        ? "bg-blue-500 text-white"
        : "bg-gray-200",
    [isNotification, isCurrUser]
  );

  useEffect(() => {
    if (content.likes.includes(state.currUserId)) setLiked(true);

    setMessageDecrypt(handleMessage());
  }, []);

  return (
    <div className="z-0 my-1 relative transition-all">
      <div className="flex gap-2">
        {!isCurrUser && state.currRoomId && !isNotification && (
          <div>
            <Avatar src={getUser()?.avatar || ""} />
          </div>
        )}
        <div
          className={`w-full ${
            isCurrUser && !isNotification ? "ml-12" : "mr-12"
          }`}
        >
          <div
            className={`max-w-fit min-w-3 relative ${
              isCurrUser && !isNotification && "float-right"
            }`}
            onClick={handleOpenDeleteBtn}
          >
            {content.image && (
              <div>
                <img
                  ref={imageRef}
                  src={content.image}
                  alt="image"
                  loading="lazy"
                  className="max-h-56 rounded-sm max-w-full bg-image-placeholder bg-cover bg-no-repeat"
                />
              </div>
            )}
            {messageDecrypt && (
              <p className={`p-1 rounded shadow max-w-lg shadow-slate-300 ${messageColor}`}>
                {messageDecrypt}
              </p>
            )}

            <div className={`flex gap-2 ${isCurrUser && !isNotification ? "justify-end" : "justify-start"}`}>
              {!isCurrUser && state.currRoomId && !isNotification && (
                <p className="text-ssm">{getUser()?.name}</p>
              )}
              <p
                className={`text-ssm text-gray-60`}
              >
                {Time(content.time)}
              </p>
            </div>
            {(isCurrUser || isRoomMaster) && (
              <div className={`absolute ${ isCurrUser ? "bottom-0 -left-6" : "top-0 left-full" } rounded-full`}>
                {content.likes.length > 0 && (content.userId === state.currUserId) && (
                  <div className="flex">
                    <span className="text-ssm font-normal">
                      {content.likes.length}
                    </span>
                    <LikeIcon w={15} h={15} color="#4920ff" />
                  </div>
                )}
                <div
                  className={`p-1  hover:bg-red-500 cursor-pointer rounded-md ${
                    openDeleteBtn === false && "hidden"
                  }`}
                  onClick={handleDeleteMessage}
                >
                  <DeleteIcon w={15} h={15} />
                </div>
              </div>
            )}
            {!isCurrUser && !isNotification && (
              <div
                onClick={handleLikeMessage}
                className={`absolute bottom-0 left-full p-1 rounded-full cursor-pointer`}
              >
                <LikeIcon w={15} h={15} color={liked ? "#4920ff" : "#dddcdc"} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
