/*global chrome*/
/*global browser*/
import React, { useState, useEffect } from "react";
import { setCurrentURL } from "./functions";
import { BROWSER_API } from "../utils/browserApi";
import { HeadingContainer, MiddleContainer } from "./Popup.styles";
import logo from "../images/zeeguu128.png";
import PopupLoading from "./PopupLoading";
import ReportError from "../reportError/ReportError";
import {
  READABILITY_FEEDBACK,
  LANGUAGE_FEEDBACK,
  LANGUAGE_UNDEFINED,
} from "../constants";
import { injectFontAndStyles } from "../background/background";

export default function PopupContent({
  isReadable,
  languageSupported,
  user,
  tab,
  api,
  sessionId,
}) {
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [finalStateExecuted, setFinalStateExecuted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (showLoader) {
      let timerId = setTimeout(() => {
        setShowLoader(false);
      }, 800);
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [showLoader]);

  useEffect(() => {
    if (languageSupported === undefined && !finalStateExecuted) {
      let timerId = setTimeout(() => {
        setFinalStateExecuted(true);
        console.log("Executing final state:", isReadable, languageSupported);
      }, 1000);

      return () => {
        clearTimeout(timerId);
        if (!finalStateExecuted) {
          setFinalStateExecuted(true);
          console.log("Executing final state:", isReadable, languageSupported);
        }
      };
    }
  }, [languageSupported, finalStateExecuted, isReadable]);

  async function openModal() {
    BROWSER_API.scripting
      .executeScript({
        target: { tabId: tab.id },
        files: ["./main.js"],
        func: setCurrentURL(tab.url),
      })
      .then(() => {
        injectFontAndStyles(tab.id);
      });

    window.close();
  }

  const renderFeedbackSection = (feedback) => (
    <>
      {" "}
      <>
        <HeadingContainer>
          <img src={logo} alt="Zeeguu logo" />
        </HeadingContainer>
        <MiddleContainer>
          {!feedbackSuccess && (
            <>
              {user && <h1>Oh no, {user.name}!</h1>}
              <p>{feedback}</p>
              <br />
            </>
          )}
          <ReportError
            api={api}
            feedback={feedback}
            feedbackSuccess={feedbackSuccess}
            setFeedbackSuccess={setFeedbackSuccess}
            url={tab.url}
          />
        </MiddleContainer>
      </>
    </>
  );

  if (!isReadable) {
    return renderFeedbackSection(READABILITY_FEEDBACK);
  } else if (languageSupported === false && finalStateExecuted) {
    return renderFeedbackSection(LANGUAGE_FEEDBACK);
  } else if (languageSupported && finalStateExecuted) {
    openModal();
    return <></>;
  } else if (languageSupported === undefined && finalStateExecuted) {
    return renderFeedbackSection(LANGUAGE_UNDEFINED);
  }

  return (
    <>
      <PopupLoading showLoader={showLoader} setShowLoader={setShowLoader} />
    </>
  );
}
