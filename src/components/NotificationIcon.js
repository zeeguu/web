import * as s from "./NotificationIcon.sc";
import strings from "../i18n/definitions";
import React from "react";
import { useState, useEffect } from "react";

export default function NotificationIcon({ text }) {
  return (
    <s.NotificationIcon>
      <div>{text}</div>
    </s.NotificationIcon>
  );
}
