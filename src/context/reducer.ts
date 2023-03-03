import * as ACTIONS from "./actions";
import { InitialState } from "./root";

export default function reducer(
  state: InitialState,
  action: ACTIONS.ACTIONS_TYPE
) {
  switch (action.type) {
    case ACTIONS.SET_AUTHENCATED:
      return { ...state, authencated: action.payload };
    case ACTIONS.SET_OPEN_CHAT:
      return { ...state, isOpenChat: action.payload}
    case ACTIONS.SET_USERS:
      return { ...state, users: action.payload };
    case ACTIONS.SET_ROOMS:
      return { ...state, rooms: action.payload };
    case ACTIONS.SET_USERS_ONLINE:
      return { ...state, usersOnline: action.payload }
    case ACTIONS.SET_FRIENDS:
      return { ...state, friends: action.payload }
    case ACTIONS.SET_REQUEST:
      return { ...state, request: action.payload }
    case ACTIONS.SET_CURR_USER_ID:
      return { ...state, currUserId: action.payload };
    case ACTIONS.SET_CURR_ROOM_ID:
      return { ...state, currRoomId: action.payload };
    case ACTIONS.SET_OTHER_ID:
      return { ...state, otherId: action.payload };
    case ACTIONS.SET_OPEN_LIST:
      return { ...state, openList: action.payload }
    case ACTIONS.SET_CONTAINERS:
      return { ...state, containers: action.payload }
    default:
      return { ...state }
  }
}
