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
import { ArticleAsync } from "../InjectedReaderApp/Article";

// Use extension runtime URL instead of direct import
const logo = chrome?.runtime?.getURL ? chrome.runtime.getURL("images/zeeguu128.png") : "/images/zeeguu128.png";

export default function PopupContent({ isReadable, languageSupported, user, tab, api, sessionId, articleData, fragmentData, loadingProgress: passedLoadingProgress }) {
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [finalStateExecuted, setFinalStateExecuted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [article, setArticle] = useState(articleData);
  const [loadingProgress, setLoadingProgress] = useState(passedLoadingProgress || "Analyzing page...");

  useEffect(() => {
    // Hide loader only when we're ready to show final content
    if (showLoader && finalStateExecuted) {
      setShowLoader(false);
    }
  }, [showLoader, finalStateExecuted]);

  useEffect(() => {
    // Update loading progress from parent
    if (passedLoadingProgress) {
      setLoadingProgress(passedLoadingProgress);
    }
  }, [passedLoadingProgress]);

  useEffect(() => {
    // Update article data from parent
    if (articleData && !article) {
      setArticle(articleData);
    }
  }, [articleData, article]);

  useEffect(() => {
    // If languageSupported is already determined, set final state
    if (languageSupported !== undefined && !finalStateExecuted) {
      setFinalStateExecuted(true);
    } else if (languageSupported === undefined && !finalStateExecuted) {
      let timerId = setTimeout(() => {
        // Only set final state if language is still undefined after timeout
        if (languageSupported === undefined) {
          setFinalStateExecuted(true);
        }
      }, 2000); // Increased timeout to give more time for language check

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
      // Store URL and article data for the content script to access
      setCurrentURL(tab.url);
      await BROWSER_API.storage.local.set({ 
        articleData: article,
        fragmentData: fragmentData,
        sessionId: sessionId,
        url: tab.url
      });

      await BROWSER_API.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["contentScript.js"],
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
              <p>{feedback}</p>
              {feedback === LANGUAGE_FEEDBACK}
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

  // Check if we're on zeeguu.org
  const isZeeguuSite = tab?.url && (tab.url.includes("zeeguu.org") || tab.url.includes("localhost:3000"));

  if (isZeeguuSite) {
    return (
      <>
        <HeadingContainer>
          <img src={logo} alt="Zeeguu logo" />
        </HeadingContainer>
        <MiddleContainer style={{ textAlign: "center" }}>
          <h2>Already on Zeeguu!</h2>
          <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
            Use this extension when reading articles on other websites to get instant translations.
          </p>
        </MiddleContainer>
      </>
    );
  }

  if (!isReadable) {
    return renderFeedbackSection(READABILITY_FEEDBACK);
  } else if (languageSupported === false && finalStateExecuted) {
    return renderFeedbackSection(LANGUAGE_FEEDBACK);
  } else if (languageSupported && finalStateExecuted && article && fragmentData) {
    openModal();
    return <></>;
  }


  return (
    <>
      <PopupLoading showLoader={showLoader} setShowLoader={setShowLoader} loadingText={loadingProgress} />
    </>
  );
}
