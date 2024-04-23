import * as s from "./NotificationIcon.sc";
import React from "react";

export default function NotificationIcon({ text, position }) {
  const notificationLocation = position ? position : "top";
  return (
    <s.NotificationIcon className={notificationLocation}>
      <div>{text}</div>
    </s.NotificationIcon>
  );
}
