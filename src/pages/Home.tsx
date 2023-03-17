import { memo, useContext, useEffect, useRef } from "react";
import Chat from "../components/chat/Chat";
import Lists from "../components/lists/Lists";
import Navbar from "../components/Navbar";
import { SET_USERS_ONLINE } from "../context/actions";
import { Context } from "../context/root";
import { socket } from "../context/socket";
import { ToastContainer } from "react-toastify";

const Home = () => {
  const { state, dispatch } = useContext(Context);
  const navRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    
    socket.emit("user_connected", state.currUserId);
    
    socket.on("users_online", (users: { id: string; socketId: string }[]) => {
      dispatch({ type: SET_USERS_ONLINE, payload: users });
    });

    return () => {
      socket.off("user_connected")
      socket.off("users_online")
      socket.connected && socket.off("connect")
      socket.connected && socket.disconnect()
    }
  }, []);

  useEffect(() => {
    const containers = document.querySelectorAll(".boxContainer");
    const handleClick = (e: globalThis.MouseEvent) => {
      // check if click target is inside one of the container
      const element = [...containers].find(elm => elm.contains(e.target as HTMLDivElement));
      
      if (!element) {
        containers.forEach(elm => { 
          if ( elm.lastChild ) { 
            (elm.lastChild as HTMLDivElement).style.display = "none";
          }
        })
        return
      }

      containers.forEach(elm => {
        if (element.lastChild && elm === element) (element.lastChild as HTMLDivElement).style.display = "block"
        else {
          if (element.lastChild) (elm.lastChild as HTMLDivElement).style.display = "none"
        }
      });
    }
    document.addEventListener("click", handleClick )

    return () => {
      document.removeEventListener("click", handleClick )
    }
  }, [state.currRoomId])

  return (
    <div className="">
      <ToastContainer />
      <Navbar ref={navRef} />
      <div
        className={
          "flex overflow-hidden relative"
        }
        style={{
          height: `calc(100vh - ${navRef.current?.offsetHeight}px)`
        }}
      >
        <Lists />
        <Chat />
      </div>
    </div>
  );
};

export default Home;
