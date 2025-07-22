/*global chrome*/
/*global browser*/
import { useState, useEffect } from "react";
import { setCurrentURL } from "./functions";
import { BROWSER_API } from "../utils/browserApi";
import { HeadingContainer, MiddleContainer } from "./Popup.styles";
import PopupLoading from "./PopupLoading";
import ReportError from "../reportError/ReportError";
import { READABILITY_FEEDBACK, LANGUAGE_FEEDBACK, LANGUAGE_UNDEFINED } from "../constants";
import { injectFontAndStyles } from "../background/background";

// Use extension runtime URL instead of direct import
const logo = chrome?.runtime?.getURL ? chrome.runtime.getURL("images/zeeguu128.png") : "/images/zeeguu128.png";

export default function PopupContent({ isReadable, languageSupported, user, tab, api, sessionId }) {
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
    // If languageSupported is already determined (not undefined), set finalStateExecuted immediately
    if (languageSupported !== undefined && !finalStateExecuted) {
      setFinalStateExecuted(true);
    } else if (languageSupported === undefined && !finalStateExecuted) {
      let timerId = setTimeout(() => {
        setFinalStateExecuted(true);
      }, 1000);

      return () => {
        clearTimeout(timerId);
        if (!finalStateExecuted) {
          setFinalStateExecuted(true);
        }
      };
    }
  }, [languageSupported, finalStateExecuted, isReadable]);

  async function openModal() {
    try {
      // Store URL for the content script to access
      setCurrentURL(tab.url);

      await BROWSER_API.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["./main.js"],
      });

      await injectFontAndStyles(tab.id);
    } catch (error) {
      console.error("Error executing script:", error);
      return; // Don't close window if there was an error
    }

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
