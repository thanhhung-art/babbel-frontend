import {
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  ChangeEvent,
} from "react";
import { SET_ROOMS } from "../../context/actions";
import { Context } from "../../context/root";
import { socket } from "../../context/socket";
import Avatar from "../Avatar";

const SettingsRoom = () => {
  const { state, dispatch } = useContext(Context);
  const nameRef = useRef<HTMLInputElement>(null);
  const [linkToImage, setLinkToImage] = useState("");
  const room = state.rooms.find(room => room._id === state.currRoomId)

  const dataUpload = useRef<{
    id: string;
    name: string;
    image: string | ArrayBuffer | null;
  }>({ id: "", name: "", image: null });

  const loadFile = function (event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        dataUpload.current.image = reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);

      setLinkToImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleUpload = () => {
    if (nameRef.current && nameRef.current.value && dataUpload.current.image) {
      dataUpload.current.id = state.currRoomId
      dataUpload.current.name = nameRef.current.value
    }

    if (typeof dataUpload.current.image === 'string') {
      socket.emit("edit_room_info", dataUpload.current, (response: string) => {
        console.log(response)
      })
    }

    const index = state.rooms.findIndex(room => room._id === state.currRoomId)
    if (index && nameRef.current) {
      state.rooms[index].name = nameRef.current.value
      state.rooms[index].avatar = linkToImage
      dispatch({ type: SET_ROOMS, payload: [...state.rooms ]})
    }
  }

  useLayoutEffect(() => {
    const room = state.rooms.find((room) => room._id === state.currRoomId);
    if (nameRef.current && room) {
      nameRef.current.value = room.name;
    }
  }, []);

  return (
    <div className="border shadow-md absolute top-full right-0 bg-white p-2 z-50">
      <div className="flex items-center justify-center">
        <div>
          <label className="cursor=pointer">
            <Avatar src={room?.avatar || ""} />
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
      <div>
        <input
          type="text"
          ref={nameRef}
          placeholder="room name"
          className="text-sm text-gray-700 p-1 outline-none border border-gray-300 my-1 rounded"
        />
      </div>
      <button onClick={handleUpload} className="text-sm text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 p-1 w-full rounded shadow">update seting</button>
      <button className="text-sm text-white bg-red-500 hover:bg-red-600 active:bg-red-700 p-1 rounded shadow w-full mt-1">delete room</button>
    </div>
  );
};

export default SettingsRoom;
