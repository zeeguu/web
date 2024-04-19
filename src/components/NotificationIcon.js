import * as s from "./NotificationIcon.sc";
import React from "react";

export default function NotificationIcon({ text }) {
  return (
    <s.NotificationIcon>
      <div>{text}</div>
    </s.NotificationIcon>
  );
}
