import { useState } from "react";
import { setCurrentURL } from "./functions";
import { PrimaryButton, NotifyButton } from "./Popup.styles";
import sendFeedbackEmail from "../JSInjection/Modal/sendFeedbackEmail";

export default function PopupContent({isReadable, languageSupported, user, tab, api, sessionId}) {
    const [feedbackSent, setFeedbackSent] = useState(false);
    const LANGUAGE_FEEDBACK = "I want this language to be supported";
    const READABILITY_FEEDBACK = "I think this article should be readable";

    async function openModal() {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["./main.js"],
        func: setCurrentURL(tab.url),
      });
      window.close();
    }

    function sendFeedback(feedback, url, articleId) {
      api.session = sessionId;
      sendFeedbackEmail(api, feedback, url, articleId);
      setFeedbackSent(true);
    }

  return (
    <>
      {isReadable === true && languageSupported === true && (
        <>
          {user ? <h1>Happy reading, {user.name}!</h1> : null}
          <PrimaryButton primary onClick={openModal}>
            Read article
          </PrimaryButton>
        </>
      )}
      {isReadable === true && languageSupported === false && (
        <>
          {user ? <h1>Oh no, {user.name}!</h1> : null}
          <p>This article language is not supported</p>
          {!feedbackSent ? (
            <NotifyButton
              onClick={() => sendFeedback(LANGUAGE_FEEDBACK, tab.url, undefined)}>
              Do you want us to support this language? Send feedback.
            </NotifyButton>
          ) : (
            <NotifyButton disabled>Thanks for the feedback</NotifyButton>
          )}
        </>
      )}
      {isReadable === false && languageSupported === false && (
        <>
          {user ? <h1>Oh no, {user.name}!</h1> : null}
          <p>Zeeguu can't read this text. Try another one</p>
          {!feedbackSent ? (
            <NotifyButton onClick={() => sendFeedback(READABILITY_FEEDBACK, tab.url, undefined)}>
              Should this be readable? Send feedback.
            </NotifyButton>
          ) : (
            <NotifyButton disabled>Thanks for the feedback</NotifyButton>
          )}
        </>
      )}
    </>
  );
}
