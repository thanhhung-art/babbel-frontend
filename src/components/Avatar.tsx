import RoomIcon from "./icons/RoomIcon";
import UserPlaceholder from "./icons/UserPlaceholder"

interface IProps {
  src: string;
  newSrc?: string;
  w?: number;
  h?: number;
  type?: "user" | "room";
}

const Avatar = ({ src, newSrc = '', w , h, type = 'user' }: IProps) => {

  return (
    <div>
      <div className={`h-${h ? h : 8} w-${w ? w : 8}`}>
        { newSrc && <img src={newSrc} width={32} height={32} className='w-full h-full object-cover rounded-full' /> }
        { src && <img src={src} width={32} height={32} className='w-full h-full object-cover rounded-full' /> }
        { !src && type === 'user' && <div className="flex items-center justify-center h-full rounded-full bg-slate-300"><UserPlaceholder /></div>}
        { !src && type === 'room' && <div className="flex items-center justify-center h-full"><RoomIcon /></div>}
      </div>
    </div>
  )
}

export default Avatar