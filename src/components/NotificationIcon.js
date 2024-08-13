import * as s from "./NotificationIcon.sc";
import React from "react";
import { Tooltip } from "@mui/material";

export default function NotificationIcon({
  text,
  position,
  style,
  tooltipText,
}) {
  const notificationLocation = position ? position : "top";
  return (
    <s.NotificationIcon className={notificationLocation} style={style}>
      <Tooltip title={tooltipText}>
        <div>{text}</div>
      </Tooltip>
    </s.NotificationIcon>
  );
}
