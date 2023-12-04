import React, { useState, useEffect } from "react";
import { setCurrentURL } from "./functions";
import sendFeedbackEmail from "../JSInjection/Modal/sendFeedbackEmail";
import { runningInChromeDesktop } from "../zeeguu-react/src/utils/misc/browserDetection";
import { HeadingContainer, MiddleContainer } from "./Popup.styles";
import logo from "../images/zeeguu128.png";
import PopupLoading from "./PopupLoading";
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import colors from "../JSInjection/colors";

export default function PopupContent({isReadable, languageSupported, user, tab, api, sessionId,}) {
  const LANGUAGE_FEEDBACK = "This language is not supported yet";
  const LANGUAGE_UNDEFINED = "Language support information is unavailable";
  const READABILITY_FEEDBACK = "This text is not readable";

  const [feedbackSent, setFeedbackSent] = useState(false);
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
    if (runningInChromeDesktop()) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["./main.js"],
        func: setCurrentURL(tab.url),
      });
    } else {
      browser.tabs.executeScript(
        tab.id,
        { file: "./main.js" },
        setCurrentURL(tab.url)
      );
    }
    window.close();
  }

  const sendFeedback = (feedback, feedbackType) => {
    api.session = sessionId;
    sendFeedbackEmail(api, feedback, tab.url, undefined, feedbackType);
    setFeedbackSent(true);
    setFeedbackSuccess(true);
  }

  const renderFeedbackSection = (feedback, feedbackType) => (
    <> {feedbackSuccess ? (
        <>
           <HeadingContainer>
            <img src={logo} alt="Zeeguu logo" />
          </HeadingContainer>
          <MiddleContainer>
            <Alert severity="success">Thanks for the feedback</Alert>
          </MiddleContainer>
        </>
        ) : (
        <>
          {<HeadingContainer>
            <img src={logo} alt="Zeeguu logo" />
          </HeadingContainer>}
          {<MiddleContainer>
            {user && <h1>Oh no, {user.name}!</h1>}
            <p>{feedback}</p><br/>
            {!feedbackSent && (
            <Link style={{ textTransform: 'none', color:`${colors.darkBlue}`}}
              component="button"
              underline="always"
              onClick={() => sendFeedback(feedback, feedbackType)}
            >
              {'Report issue'}
            </Link>
          )}
          </MiddleContainer>}
        </>
        )}
    </>
  );

  if (!isReadable) {
    return renderFeedbackSection(READABILITY_FEEDBACK, "READABLE_");
  } else if (languageSupported === false && finalStateExecuted) {
    return renderFeedbackSection(LANGUAGE_FEEDBACK, "LANGUAGE_");
  } else if (languageSupported && finalStateExecuted) {
    return (<>{openModal()}</>);
  } else if (languageSupported === undefined && finalStateExecuted) {
    return renderFeedbackSection(LANGUAGE_UNDEFINED, "LANGUAGE_");
  }

  return <><PopupLoading showLoader={showLoader} setShowLoader={setShowLoader} /></>;
}