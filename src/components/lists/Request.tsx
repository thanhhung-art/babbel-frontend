import { Dispatch, Fragment, SetStateAction, useContext, useEffect, useState } from "react";
import { SET_FRIENDS } from "../../context/actions";
import { Context } from "../../context/root";
import { socket } from "../../context/socket";
import Avatar from "../Avatar";

interface IProps {
  request: string[]
  setRequest: Dispatch<SetStateAction<string[]>>
}

const Request = ({ request, setRequest }: IProps) => {
  const { state, dispatch } = useContext(Context)

  const handleAcceptRequest = (receiverId: string) => {
    socket.emit('accept_friend_request', receiverId)
    
    const index = request.indexOf(receiverId)
    request.splice(index, 1)
    setRequest([...request])
    dispatch({ type: SET_FRIENDS, payload: [...state.friends, receiverId ]})
  }

  const handleDeclineRequest = (receiverId: string) => {
    socket.emit('decline_friend_request', receiverId)

    const index = request.indexOf(receiverId)
    request.splice(index, 1)
    setRequest([...request])
  }

  return (
    <div>
      {request.length === 0 && (
        <div>
          <p>No request to show</p>
        </div>
      )}
      {request.length > 0 &&
        request.map((userId) => {
          const user = state.users.find(user => user._id === userId)
          if (user) {
            return (
              <div className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-md" key={userId}>
                <div className="flex items-center gap-2">
                  <Avatar src={user.avatar} />
                  <p className="text-sm" title={user.name}>{user.name.length > 9 ? user.name.slice(0,7) + ' ...' : user.name }</p>
                </div>
                <div className="flex ml-2">
                  <button 
                    className="py-1 px-2 shadow bg-green-500 hover:bg-green-600 text-white rounded-full text-sm"
                    onClick={() => handleAcceptRequest(user._id)}  
                  >accept</button>
                  <button 
                    className="ml-2 py-1 px-2 shadow bg-red-500 hover:bg-red-600 text-white rounded-full text-sm"
                    onClick={() => handleDeclineRequest(user._id)}
                  >decline</button>
                </div>
              </div>
            )
          }

          return <Fragment key={userId}></Fragment>;
        })}
    </div>
  );
};

export default Request;
