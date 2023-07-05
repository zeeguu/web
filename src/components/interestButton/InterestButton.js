import React from "react";
import * as s from "./InterestButton.sc";

export const variants = {
  grayOutlined: "GrayOutlined",
  grayFilled: "GrayFilled",
  orangeOutlined: "OrangeOutlined",
  orangeFilled: "OrangeFilled",
};

export const InterestButton = ({
  title,
  icon,
  variant,
  onClick = () => {},
  isDisabled,
}) => {
  return (
    <s.InterestButton
      variant={variant}
      disabled={isDisabled}
      onClick={() => onClick(title)}
    >
      {icon}
      {title}
    </s.InterestButton>
  );
};
