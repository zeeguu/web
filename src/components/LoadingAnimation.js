import * as s from "./LoadingAnimation.sc";
import strings from "../i18n/definitions";
import React from "react";
import { useState, useEffect } from "react";

export default function LoadingAnimation({ text, delay = 1000 }) {
  let _text = text ? text : strings.loadingMsg;
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  useEffect(() => {
    // Code from: https://stackoverflow.com/questions/53090432/react-hooks-right-way-to-clear-timeouts-and-intervals
    // Only show the loading if more that 1000ms have passed.
    let loadingTimer = setTimeout(() => setShowLoadingScreen(true), delay);
    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <>
      {showLoadingScreen ? (
        <s.LoadingAnimation>
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </s.LoadingAnimation>
      ) : (
        <div></div>
      )}
    </>
  );
}
