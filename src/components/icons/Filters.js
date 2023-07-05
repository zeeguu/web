import React from "react";
import { zeeguuSecondOrange } from "../colors";

export const Filters = ({ color = zeeguuSecondOrange }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1380_1637)">
      <path
        d="M12 2.00004L14 2.00004L14 3.33337L12 3.33337L12 4.66671L10.6667 4.66671L10.6667 0.666707L12 0.666707L12 2.00004ZM12 12.6667L14 12.6667L14 14L12 14L12 15.3334L10.6667 15.3334L10.6667 11.3334L12 11.3334L12 12.6667ZM4 8.66671L2 8.66671L2 7.33337L4 7.33337L4 6.00004L5.33333 6.00004L5.33333 10L4 10L4 8.66671ZM6.66667 8.66671L6.66667 7.33337L14 7.33337L14 8.66671L6.66667 8.66671ZM9.33333 14L2 14L2 12.6667L9.33333 12.6667L9.33333 14ZM9.33333 3.33337L2 3.33337L2 2.00004L9.33333 2.00004L9.33333 3.33337Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_1380_1637">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(0 16) rotate(-90)"
        />
      </clipPath>
    </defs>
  </svg>
);
