import { Fragment, memo, useContext } from 'react'
import { Context } from '../../context/root'
import Item from './Item';

interface IProps {
  handleClick: Function;
}

const UsersOnline = ({ handleClick }: IProps) => {
  const { state } = useContext(Context)

  return (
    <>
      {state.friends.sort().map(userId => {
        const user = state.users.find(user => user._id === userId)
        if (user && state.usersOnline.find(user => user.id === userId)) {
          return (
            <Fragment key={userId}>
              <Item _id={userId} handleClick={handleClick} avatar={user.avatar} name={user.name} type='user' />
            </Fragment>
          )
        }
        return <Fragment key={userId}></Fragment>
      })}
    </>
  )
}

export default memo(UsersOnline)