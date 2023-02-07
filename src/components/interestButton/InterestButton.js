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
  onClick,
  isDisabled = true,
}) => {
  return (
    <s.InterestButton
      variant={variant}
      disabled={isDisabled}
      onClick={() => onClick()}
    >
      {icon}
      {title}
    </s.InterestButton>
  );
};
