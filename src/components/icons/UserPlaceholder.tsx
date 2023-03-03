interface Iprops {
  w?: number;
  h?: number;
}

const UserPlaceholder = ({ w = 27, h = 27}: Iprops) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={`${w}px`}
      height={`${h}px`}
      viewBox="0 0 100 100"
      enableBackground="new 0 0 100 100"
      fill="#6d6a6a"
    >
      <g opacity="0.5">
        <g>
          <path
            d="M80,71.2V74c0,3.3-2.7,6-6,6H26c-3.3,0-6-2.7-6-6v-2.8c0-7.3,8.5-11.7,16.5-15.2c0.3-0.1,0.5-0.2,0.8-0.4
			c0.6-0.3,1.3-0.3,1.9,0.1C42.4,57.8,46.1,59,50,59s7.6-1.2,10.8-3.2c0.6-0.4,1.3-0.4,1.9-0.1c0.3,0.1,0.5,0.2,0.8,0.4
			C71.5,59.5,80,63.9,80,71.2z"
          />
        </g>
        <g>
          <ellipse cx="50" cy="36.5" rx="14.9" ry="16.5" />
        </g>
      </g>
    </svg>
  );
};

export default UserPlaceholder;
