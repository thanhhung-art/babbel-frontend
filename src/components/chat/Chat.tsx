import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  useCallback,
} from "react";
import { Context } from "../../context/root";
import { socket } from "../../context/socket";
import { Fetch } from "../../utils/fetch";
import Message from "../Message";
import CryptoJS from "crypto-js";
import Toolbar from "./Toolbar";
import TypingEffect from "../tools/TypingEffect";
import SendIcon from "../icons/SendIcon";
import FaceIcon from "../icons/FaceIcon";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import ImageIcon from "../icons/ImageIcon";

const pass_secret = import.meta.env.VITE_PASS_SECRET;

const Chat = () => {
  const queryClient = useQueryClient();
  const { state } = useContext(Context);
  const [typingMessage, setTypingMessage] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currConversationId, setCurrConversationId] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [firstTimeOpenEmoji, setFirstTimeOpenEmoji] = useState(true);
  const [linkToImage, setLinkToImage] = useState("");
  const base64Image = useRef<string | ArrayBuffer | null>("");
  const [linkImageLoaded, setLinkImageLoaded] = useState("");
  const anchorLoadMessage = useRef<HTMLDivElement>(null);
  const chatContainer = useRef<HTMLDivElement>(null);

  const createConversation = useMutation(
    () =>
      new Fetch(`/conversation/create/${state.currUserId}`, state.currUserId, {
        guestId: state.otherId,
      }).post(),
    {
      onSuccess({ data }) {
        setConversation(data.content);
        setCurrConversationId(data._id);
      },
    }
  );

  const getPersonalChatInfinite = useInfiniteQuery(
    ["getPersonalChatInfinite"],
    ({ pageParam = 0 }): IChatDataInfinite => {
      return new Fetch(
        `/conversation/${state.currUserId}/${state.otherId}?page=${pageParam}`,
        state.currUserId
      ).get();
    },
    {
      enabled: state.otherId !== "" && state.currUserId !== "",
      getNextPageParam: (nextPage: { nextPage: number; allPages: number }) => {
        if (nextPage.nextPage < Math.ceil(nextPage.allPages / 10)) {
          return nextPage.nextPage;
        }
        return false;
      },
      onSuccess(props) {
        const { pages } = props;
        if (pages[pages.length - 1].data) {
          if (currConversationId !== pages[0].conversationId) {
            setCurrConversationId(pages[0].conversationId);
            setConversation([...pages[0].data.reverse()]);
          } else {
            setConversation([
              ...conversation,
              ...pages[pages.length - 1].data.reverse(),
            ]);
          }
        } else {
          createConversation.mutate();
        }
      },
    }
  );

  const roomChat = useInfiniteQuery(
    ["getRoomChat"],
    ({ pageParam = 0 }): IChatDataInfinite =>
      new Fetch(
        `/room/${state.currRoomId}/?page=${pageParam}`,
        state.currUserId
      ).get(),
    {
      enabled: state.currRoomId !== "",
      getNextPageParam: (nextPage: { nextPage: number; allPages: number }) => {
        if (nextPage.nextPage < Math.ceil(nextPage.allPages / 10)) {
          return nextPage.nextPage;
        }
        return false;
      },
      onSuccess({ pages }) {
        if (currConversationId !== pages[0].conversationId) {
          setCurrConversationId(pages[0].conversationId);
          setConversation([...pages[0].data].reverse());
        } else {
          setConversation([
            ...conversation,
            ...pages[pages.length - 1].data.reverse(),
          ]);
        }
      },
    }
  );

  const handleSendMessage = useCallback(() => {
    const time = `${Date.now()}`;
    if (
      (messageRef.current && messageRef.current.value !== "") ||
      (base64Image.current && base64Image.current !== "" && messageRef.current)
    ) {
      const messageEncrypted =
        messageRef.current.value !== ""
          ? CryptoJS.AES.encrypt(
              messageRef.current.value,
              pass_secret
            ).toString()
          : "";
      if (state.otherId) {
        const temp_message: Message = {
          userId: state.currUserId,
          message: messageRef.current.value,
          time,
          likes: [],
        };
        socket.emit(
          "private_message",
          {
            _id: currConversationId,
            message: messageEncrypted,
            receiverId: state.otherId,
            time,
            image: base64Image.current,
          },
          (linkImage: string) => {
            if (linkImage) {
              temp_message.image = linkImage;
              setLinkImageLoaded(linkImage);
            }
          }
        );
        setConversation((conversation) => [temp_message, ...conversation]);
      } else if (state.currRoomId) {
        socket.emit(
          "room_message",
          {
            _id: state.currRoomId,
            message: messageEncrypted,
            senderId: state.currUserId,
            time,
            image: base64Image.current,
          },
          (res: string) => {
            console.log(res);
          }
        );
      }
      base64Image.current = "";
      messageRef.current.value = "";
      setLinkToImage("");
    }
  }, [
    messageRef.current?.value,
    base64Image.current,
    state.currUserId,
    state.currRoomId,
    currConversationId,
  ]);

  const handleTypingMessage = useCallback(() => {
    if (state.otherId) {
      socket.emit("typing_a_message_in_personal_chat", {
        currConversationId,
        receiverId: state.otherId,
      });
    } else if (state.currRoomId) {
      socket.emit("typing_a_message_in_room_chat", {
        currConversationId,
        roomId: state.currRoomId,
      });
    }
  }, [state.otherId, state.currRoomId]);

  const handleStopTyping = useCallback(() => {
    if (state.otherId) {
      socket.emit("stop_typing_in_personal_chat", {
        currConversationId,
        receiverId: state.otherId,
      });
    } else if (state.currRoomId) {
      socket.emit("stop_typing_in_room_chat", {
        currConversationId,
        roomId: state.currRoomId,
      });
    }
  }, [state.otherId, state.currRoomId]);

  const handleOpenEmoji = useCallback(() => {
    if (firstTimeOpenEmoji) setFirstTimeOpenEmoji(false);
    setOpenEmoji(!openEmoji);
  }, [openEmoji]);

  const handleClickEmoji = (emojiData: EmojiClickData, event: MouseEvent) => {
    if (messageRef.current) messageRef.current.value += emojiData.emoji;
  };

  const loadFile = useCallback(
    function (event: ChangeEvent<HTMLInputElement>) {
      if (event.target.files && event.target.files.length > 0) {
        const reader = new FileReader();
        reader.onloadend = (e) => {
          base64Image.current = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);

        setLinkToImage(URL.createObjectURL(event.target.files[0]));
      }
    },
    [setLinkToImage]
  );

  const handleRemoveImage = () => setLinkToImage("");

  useEffect(() => {
    socket.on(
      "private_message",
      ({
        _id,
        message,
        from,
        time,
        image,
      }: {
        _id: string;
        message: string;
        from: string;
        time: string;
        image: string;
      }) => {
        setConversation((conversation) => [
          { userId: from, message, time, image, likes: [] },
          ...conversation,
        ]);
        chatContainer.current?.scrollBy(0, 0);
      }
    );

    socket.on(
      "room_message",
      ({
        _id,
        message,
        senderId,
        time,
        image,
      }: {
        message: string;
        senderId: string;
        _id: string;
        time: string;
        image: string;
      }) => {
        setConversation((conversation) => [
          { userId: senderId, message, time, image, likes: [] },
          ...conversation,
        ]);
        chatContainer.current?.scrollBy(0, 0);
      }
    );

    return () => {
      socket.off("private_message");
      socket.off("room_message");
    };
  }, []);

  useEffect(() => {
    socket.on("leave_room", (userId: string, message: Message) => {
      setConversation((conversation) => [message, ...conversation]);
    });

    return () => {
      socket.off("leave_room");
    };
  }, []);

  useEffect(() => {
    socket.on("a_user_typing_a_message", (conversationId: string) => {
      if (conversationId === currConversationId) {
        setTypingMessage(true);
      }
    });

    socket.on("a_user_stop_typing", (conversationId: string) => {
      if (conversationId === currConversationId) {
        setTypingMessage(false);
      }
    });

    return () => {
      socket.off("a_user_typing_a_message");
      socket.off("a_user_stop_typing");
    };
  }, [currConversationId]);

  useEffect(() => {
    if (conversation.length !== 0) {
      const deleteMessage = (id: string, time: string) => {
        const messageIndex = conversation.findIndex(
          (mess) => mess._id === id || mess.time === time
        );
        conversation.splice(messageIndex, 1);
        setConversation([...conversation]);
      };

      socket.on("delete_personal_message", deleteMessage);
      socket.on("delete_room_message", deleteMessage);
    }

    return () => {
      socket.off("delete_personal_message");
      socket.off("delete_room_message");
    };
  }, [conversation.length]);

  useEffect(() => {
    if (conversation.length && currConversationId) {
      socket.on("like_message", (conversationId, messageId, userId) => {
        if (currConversationId === conversationId) {
          setConversation(() => {
            const messageIndex = conversation.findIndex(
              (message) =>
                message._id === messageId || message.time === messageId
            );
            if (
              messageIndex > -1 &&
              !conversation[messageIndex].likes.includes(userId)
            ) {
              conversation[messageIndex].likes.push(userId);
            }
            return [...conversation];
          });
        }
      });

      socket.on("dont_like_message", (conversationId, userId, messageId) => {
        if (currConversationId === conversationId) {
          const messageIndex = conversation.findIndex(
            (message) => message._id === messageId || message.time === messageId
          );
          messageIndex > -1 &&
            conversation[messageIndex].likes.splice(
              conversation[messageIndex].likes.indexOf(userId),
              1
            );
        }
        setConversation((conversation) => [...conversation]);
      });
    }

    return () => {
      socket.off("like_message");
      socket.off("dont_like_message");
    };
  }, [currConversationId, conversation.length]);

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault();

        return handleSendMessage();
      }
    }
    messageRef.current?.addEventListener("keydown", handleKeyPress);

    return () => {
      messageRef.current?.removeEventListener("keydown", handleKeyPress);
    };
  }, [messageRef]);

  // load personal chat again
  useEffect(() => {
    if (state.currUserId && state.otherId) {
      queryClient.setQueryData(["getPersonalChatInfinite"], { pageParams: 0 });
      getPersonalChatInfinite.refetch();
    }
  }, [state.otherId]);
  // load chat room again
  useEffect(() => {
    if (state.currRoomId) {
      queryClient.setQueryData(["getRoomChat"], { pagePrams: 0 });
      roomChat.refetch();
    }
  }, [state.currRoomId]);
  // load more effect
  useEffect(() => {
    let loadmore: IntersectionObserver;
    if (
      getPersonalChatInfinite.hasNextPage &&
      anchorLoadMessage.current &&
      chatContainer.current
    ) {
      loadmore = new IntersectionObserver(
        (entries) => {
          if (
            (entries[0].isIntersecting &&
              getPersonalChatInfinite.hasNextPage) ||
            (entries[0].intersectionRatio == 1 &&
              getPersonalChatInfinite.hasNextPage)
          ) {
            if (state.otherId) {
              getPersonalChatInfinite.fetchNextPage();
            } else {
              roomChat.fetchNextPage();
            }
          }
        },
        {
          root: chatContainer.current,
          rootMargin: "50px",
          threshold: 1.0,
        }
      );
      loadmore.disconnect();
      loadmore.observe(anchorLoadMessage.current);
    }
    return () => {
      if (loadmore) loadmore.disconnect();
    };
  }, [
    anchorLoadMessage.current,
    state.otherId,
    getPersonalChatInfinite.hasNextPage,
  ]);

  useEffect(() => {
    if (linkImageLoaded && chatContainer.current)
      chatContainer.current.scrollTo(0, 0);
  }, [linkImageLoaded]);

  if (!state.isOpenChat) {
    return (
      <div className="w-full flex-1 box-border">
        <p className="text-center text-gray-400">
          Choose a user or room to chat
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex flex-col h-full">
        <Toolbar
          setConversation={setConversation}
          isFetchingMessage={
            getPersonalChatInfinite.isFetchingNextPage ||
            roomChat.isFetchingNextPage
          }
        />
        <div
          className="flex-1 px-2 sm:px-4 overflow-y-auto flex flex-col-reverse relative"
          ref={chatContainer}
        >
          {conversation.map((message) => (
            <Message
              content={message}
              setConversation={setConversation}
              key={message._id || message.time}
              currConversationId={currConversationId}
            />
          ))}
          <div ref={anchorLoadMessage}></div>
        </div>

        <div className="border-t-2 border-t-gray-300 relative">
          {typingMessage && <TypingEffect />}
          {linkToImage && (
            <div className="absolute bottom-full bg-cover">
              <div className="relative pr-1">
                <img src={linkToImage} alt="" width={50} height={50} />
                <span
                  className="absolute bottom-3/4 right-0 w-3 h-3 flex justify-center items-center bg-gray-200 text-red-500 text-ssm rounded-full cursor-pointer"
                  onClick={handleRemoveImage}
                >
                  x
                </span>
              </div>
            </div>
          )}
          {!firstTimeOpenEmoji && (
            <div
              className={`absolute bottom-full left-0 ${
                openEmoji ? "" : "hidden"
              }`}
            >
              <EmojiPicker
                onEmojiClick={handleClickEmoji}
                lazyLoadEmojis={true}
              />
            </div>
          )}
          <div className="flex">
            <div className="p-1 flex items-center gap-2">
              <div onClick={handleOpenEmoji}>
                <FaceIcon h={20} w={20} />
              </div>
              <div className="ml-1 mr-2">
                <label className="cursor=pointer">
                  <ImageIcon h={20} w={20} />
                  <input
                    type="file"
                    hidden
                    onChange={loadFile}
                    id="avatar"
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </label>
              </div>
            </div>
            <div className="flex-1 flex">
              <textarea
                id="message_input"
                ref={messageRef}
                className="outline-none resize-none text-black flex-1 p-1 h-12 font-normal"
                placeholder="write message"
                onFocus={handleTypingMessage}
                onBlur={handleStopTyping}
              />
            </div>
            <div className="shadow-xl sm:p-4 p-2 w-16 bg-cyan-600 flex items-center justify-center">
              <button onClick={handleSendMessage}>
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
