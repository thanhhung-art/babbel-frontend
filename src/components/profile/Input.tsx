import React, { forwardRef, RefObject, ForwardedRef, useState } from 'react'

interface IProps {
  ref: RefObject<HTMLInputElement>;
  type: 'password' | 'text';
  className: string;
  valueLen: number | undefined;
}

const Input = forwardRef((props: IProps, ref: ForwardedRef<HTMLInputElement>) => {
  const [showSign, setShowSign] = useState(false)

  const handleShowSign = () => setShowSign(!showSign)

  return (
    <div className='flex gap-1 relative pr-4'>
      <input ref={ref} type={props.type} className={props.className} onFocus={handleShowSign} onBlur={handleShowSign} />
      { props.valueLen && props.valueLen > 25 && !showSign && <div className='absolute right-0'>...</div>}
    </div>
  )
})

export default Input