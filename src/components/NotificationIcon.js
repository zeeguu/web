import * as s from "./NotificationIcon.sc";
import React from "react";
import { Tooltip } from "@mui/material";

export default function NotificationIcon({
  text,
  position,
  style,
  tooltipText,
  isActive,
}) {
  const notificationLocation = position ? position : "top";
  return (
    <s.NotificationIcon className={notificationLocation} style={style} $isActive={isActive}>
      <Tooltip title={tooltipText}>
        <div>{text}</div>
      </Tooltip>
    </s.NotificationIcon>
  );
}
