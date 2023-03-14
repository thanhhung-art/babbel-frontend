import React from "react";

interface IProps {
  w?: number;
  h?: number;
  color?: string;
}

const PlusIcon = ({ w = 15, h = 15, color = 'none' }: IProps) => {
  return (
    <svg
      width={`${w}px`}
      height={`${h}px`}
      viewBox="0 0 24 24"
      fill={`${color}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12H19"
        stroke="#323232"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5L12 19"
        stroke="#323232"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PlusIcon;
