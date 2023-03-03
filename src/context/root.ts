import { createContext, Dispatch } from "react";
import { ACTIONS_TYPE } from "./actions";

export interface InitialState {
  user: User | null;
  users: User[];
  rooms: Room[];
  usersOnline: { id: string; socketId: string }[];
  friends: string[];
  request: string[];
  authencated: boolean;
  currUserId: string;
  currRoomId: string;
  otherId: string;
  isOpenChat: boolean;
  openList: boolean;
  containers: Element[];
}

export const initialState: InitialState = {
  user: null,
  users: [],
  rooms: [],
  usersOnline: [],
  friends: [],
  request: [],
  authencated: false,
  currUserId: "",
  currRoomId: '',
  otherId: "",
  isOpenChat: false,
  openList: false,
  containers: [],
};

export const Context = createContext<{
  state: InitialState;
  dispatch: Dispatch<ACTIONS_TYPE>;
}>({
  state: initialState,
  dispatch: () => undefined,
});
