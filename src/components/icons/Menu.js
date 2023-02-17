import React from "react";
import { blue } from "../colors";

export const Menu = ({ color = blue }) => {
  return (
    <svg
      width="20"
      height="12"
      viewBox="0 0 20 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="1"
        y1="1"
        x2="19"
        y2="1"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="6"
        x2="11"
        y2="6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="11"
        x2="19"
        y2="11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
