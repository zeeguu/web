import * as s from "./NotificationIcon.sc";
import React from "react";

export default function NotificationIcon({ text, position, style }) {
  const notificationLocation = position ? position : "top";
  return (
    <s.NotificationIcon className={notificationLocation} style={style}>
      <div>{text}</div>
    </s.NotificationIcon>
  );
}
