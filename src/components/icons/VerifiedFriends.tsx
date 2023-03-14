interface IProps {
  w?: number;
  h?: number;
  color?: string;
}

const VerifiedFriends = ({ w = 20, h = 20 }: IProps) => {
  return (
    <svg
      fill="#000000"
      width={`${w}px`}
      height={`${h}px`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.03,18.616l5.294-4.853a1,1,0,0,1,1.352,1.474l-6,5.5a1,1,0,0,1-1.383-.03l-3-3a1,1,0,0,1,1.414-1.414ZM1,20a9.01,9.01,0,0,1,5.623-8.337A4.981,4.981,0,1,1,10,13a7.011,7.011,0,0,0-6.929,6H10a1,1,0,0,1,0,2H2A1,1,0,0,1,1,20ZM7,8a3,3,0,1,0,3-3A3,3,0,0,0,7,8Z" />
    </svg>
  );
};

export default VerifiedFriends;
