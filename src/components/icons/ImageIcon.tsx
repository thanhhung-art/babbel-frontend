interface IProps {
  w?: number;
  h?: number;
}

const ImageIcon = ({ w = 15, h = 15 }: IProps) => {
  return (
    <svg
      width={`${w}px`}
      height={`${h}px`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 7C3 4.79086 4.79086 3 7 3H17C19.2091 3 21 4.79086 21 7V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V7Z"
        stroke="#000000"
        strokeWidth="2"
      />
      <path
        d="M9 11C10.1046 11 11 10.1046 11 9C11 7.89543 10.1046 7 9 7C7.89543 7 7 7.89543 7 9C7 10.1046 7.89543 11 9 11Z"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 20L6.87381 16.4077C7.51098 15.6113 8.65134 15.4342 9.5 16C10.3487 16.5658 11.489 16.3887 12.1262 15.5922L13.7254 13.5933C14.4252 12.7185 15.7069 12.5891 16.5675 13.3062L21 17"
        stroke="#000000"
        strokeWidth="2"
      />
    </svg>
  );
};

export default ImageIcon;
