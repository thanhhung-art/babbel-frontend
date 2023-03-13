import {
  useContext,
  useState,
  forwardRef,
  ForwardedRef,
  lazy,
  Suspense,
  useMemo,
} from "react";
import { Context } from "../context/root";
import Avatar from "./Avatar";
import { SET_OPEN_LIST } from "../context/actions";
import MenuIcon from "./icons/MenuIcon";
import BellIcon from "./icons/BellIcon";
const Profile = lazy(() => import("./profile/Profile"));

const Navbar = forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => {
  const { state, dispatch } = useContext(Context);
  const [showNotification, setShowNotification] = useState(false);
  const user = useMemo(
    () => state.users.find((user) => user._id === state.currUserId),
    [state.users.length]
  );

  const handleShowNotification = () => setShowNotification(!showNotification);
  const handleOpenList = () =>
    dispatch({ type: SET_OPEN_LIST, payload: !state.openList });

  return (
    <nav
      ref={ref}
      className="shadow-sm bg-blue-500 sticky text-white w-full flex items-center p-4 z-50"
    >
      <h2 className="font-bold text-lg">Babbel</h2>
      <div className="flex-1"></div>
      {/* <div className="relative mr-2" onClick={handleShowNotification}>
        <BellIcon />
        <div className="absolute -top-1 -left-1 bg-blue-500 w-4 h-4 rounded-full flex justify-center items-center">
          <p className="text-white text-ssm">1</p>
        </div>
      </div> */}
      <div className="cursor-pointer relative mr-2 boxContainer">
        <div>
          <Avatar src={user?.avatar || ""} />
        </div>
        <Suspense>
          <Profile />
        </Suspense>
      </div>
      <div onClick={handleOpenList} className="ml-2 sm:hidden cursor-pointer">
        <MenuIcon />
      </div>
    </nav>
  );
});

export default Navbar;
