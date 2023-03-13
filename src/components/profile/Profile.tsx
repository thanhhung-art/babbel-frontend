import {
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  ChangeEvent,
  useMemo,
} from "react";
import { Context } from "../../context/root";
import { socket } from "../../context/socket";
import Avatar from "../Avatar";
import CryptoJS from "crypto-js";
import ShowPass from "../../public/icons/eye-svgrepo-com.svg";
import HidePass from "../../public/icons/eye-hide-svgrepo-com.svg";
import { Fetch } from "../../utils/fetch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import Input from "./Input";
interface IDataUpload {
  name: string;
  email: string;
  password: string;
  image: string | ArrayBuffer | null | undefined;
}
const pass_secret = import.meta.env.VITE_PASS_SECRET;

const Profile = () => {
  const { state } = useContext(Context);
  const [linkToImage, setLinkToImage] = useState("");
  const [passType, setPassType] = useState<"text" | "password">("password");
  const base64Image = useRef<string | ArrayBuffer | null>("");
  const dataUpload = useRef<IDataUpload>({
    email: "",
    name: "",
    password: "",
    image: null,
  });
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const userAvatar = state.users.find(
    (user) => user._id === state.currUserId
  )?.avatar;
  const navigate = useNavigate();
  const currUser = useMemo(() => {
    return state.users.find((user) => user._id === state.currUserId);
  }, [state.currUserId, state.users.length]);

  const logout = useMutation(
    ["logout"],
    () => {
      return new Fetch("/auth/logout", state.currUserId).delete();
    },
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  const loadFile = function (event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        base64Image.current = reader.result;
        dataUpload.current.image = reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);

      setLinkToImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleUpload = () => {
    if (emailRef.current && nameRef.current && passwordRef.current) {
      const encryptPass = CryptoJS.AES.encrypt(
        passwordRef.current.value,
        pass_secret
      ).toString();

      dataUpload.current.email = emailRef.current.value;
      dataUpload.current.name = nameRef.current.value;
      dataUpload.current.password = encryptPass;
    }

    if (typeof dataUpload.current.image == "string") {
      socket.emit(
        "edit_user_info",
        dataUpload.current,
        (response: { success: boolean; image_url?: string }) => {
          if (response.success) {
          }
        }
      );
    }
  };

  const handleConvertType = () => {
    if (passType === "text") {
      setPassType("password");
      return;
    }
    setPassType("text");
  };

  const handleLogout = () => {
    logout.mutate();
    googleLogout();
    navigate("/login");
    localStorage.removeItem("chatfun_userId");
  };

  useLayoutEffect(() => {
    const user = state.users.find((user) => user._id === state.currUserId);
    if (user && emailRef.current && nameRef.current) {
      if (user.password && passwordRef.current) {
        const decryptPass = CryptoJS.AES.decrypt(
          user.password,
          pass_secret
        ).toString(CryptoJS.enc.Utf8);

        passwordRef.current.value = decryptPass;
      }
      emailRef.current.value = user.email;
      nameRef.current.value = user.name;
    }
  }, [state.users.length]);

  return (
    <div
      className="absolute top-full right-0 border shadow-lg p-4 bg-white text-gray-700 rounded-lg z-20"
      style={{ display: "none" }}
    >
      <div className="flex justify-center">
        <div className="cursor-pointer">
          <label className="cursor=pointer">
            <Avatar src={userAvatar || ""} newSrc={linkToImage} />
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
      <div className="flex gap-1">
        <h3 className="w-14">email :</h3>
        <Input ref={emailRef} valueLen={emailRef.current?.value.length} type='text' className="outline-none w-fit" />
      </div>
      <div className="flex gap-2">
        <h3 className="w-14">name :</h3>
        <Input ref={nameRef} type="text" className="outline-none w-fit" valueLen={nameRef.current?.value.length} />
      </div>
      {currUser && currUser.password && (
        <div className="flex gap-2 relative">
          <h3 className="w-12">password:</h3>
          <input
            ref={passwordRef}
            type={passType}
            className="outline-none w-fit"
          />
          <img
            src={passType === "password" ? ShowPass : HidePass}
            width={18}
            className="absolute right-0 top-1/2 -translate-y-1/2"
            onClick={handleConvertType}
          />
        </div>
      )}
      <div className="mt-2">
        <button
          onClick={handleUpload}
          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full py-1 px-3 shadow-sm shadow-blue-300"
        >
          update info
        </button>
      </div>
      <div className="mt-2">
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full py-1 px-3 shadow-sm shadow-blue-300"
          onClick={handleLogout}
        >
          log out
        </button>
      </div>
    </div>
  );
};

export default Profile;
