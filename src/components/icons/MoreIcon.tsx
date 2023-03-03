
interface Iprops {
  w?: number;
  h?: number;
}

const MoreIcon = ({ w = 22, h = 22 }: Iprops) => {
  return (
    <svg
      width={`${w}px`}
      height={`${h}px`}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" fill="#fff" fillOpacity="0.01" />
      <circle cx="24" cy="12" r="3" fill="#6c757d" />
      <circle cx="24" cy="24" r="3" fill="#6c757d" />
      <circle cx="24" cy="35" r="3" fill="#6c757d" />
    </svg>
  );
};

export default MoreIcon;
