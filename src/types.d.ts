declare interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  friends: string[];
  online: boolean;
  avatar: string;
  roomJoined: string[];
  notification: [{
    msg: string;
    time: string;
    unread: boolean;
    senderId: string;
    _id: string;
  }]
}

declare interface UserLogin {
  email: string;
  password: string;
}

declare interface IResultQuery {
  msg: string;
}

declare interface IResultUsersQuery extends IResultQuery {
  data: User[];
}

declare interface IResultUserQuery extends IResultQuery {
  data: User;
}

declare interface Message {
  _id?: string;
  message: string;
  userId: string;
  time: string;
  image?: string;
  likes: string[];
}

declare type IPersonalChatInfinite = Promise<{ nextPage: number; data: Message[], conversationId: string, msg: string, allPages: number}>
declare type IChatDataInfinite = Promise<{ nextPage: number; data: Message[], conversationId: string, msg: string, allPages: number}>

declare interface Conversation {
  content: Message[];
}

declare interface IArrivalMessage {
  _id: string;
  userId: string;
  message: string;
  time: string;
  image: string;
  likes: string[];
}

declare interface Room {
  _id: string;
  roomMasterId: string;
  name: string;
  avatar: string;
  members: string[];
  joinRequest: string[];
  content: [{
    message: string;
    userId: string;
    time: string;
  }]
}

declare interface IResultRoomQuery {
  msg: string;
  data: Room[]
}

declare interface IResultFriendReqQuery {
  msg: string;
  data: string[];
}