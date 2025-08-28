/*global chrome*/
/*global browser*/
import { useEffect, useState } from "react";
import { setCurrentURL } from "./functions";
import { BROWSER_API } from "../utils/browserApi";
import { HeadingContainer, MiddleContainer } from "./Popup.styles";
import PopupLoading from "./PopupLoading";
import ReportError from "../reportError/ReportError";
import TranslationPrompt from "./TranslationPrompt";
import { LANGUAGE_FEEDBACK, READABILITY_FEEDBACK } from "../constants";
import { injectFontAndStyles } from "../background/background";

// Use extension runtime URL instead of direct import
const logo = chrome?.runtime?.getURL ? chrome.runtime.getURL("images/zeeguu128.png") : "/images/zeeguu128.png";

export default function PopupContent({
  isReadable,
  languageSupported,
  user,
  tab,
  api,
  sessionId,
  articleData,
  fragmentData,
  loadingProgress: passedLoadingProgress,
  detectedLanguage: passedDetectedLanguage,
}) {
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [finalStateExecuted, setFinalStateExecuted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [article, setArticle] = useState(articleData);
  const [loadingProgress, setLoadingProgress] = useState(passedLoadingProgress || "Analyzing page...");
  const [showTranslationPrompt, setShowTranslationPrompt] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(passedDetectedLanguage);
  const [translatedArticle, setTranslatedArticle] = useState(null);
  const [translatedFragments, setTranslatedFragments] = useState(null);
  const [learnedLanguage, setLearnedLanguage] = useState(null);

  // Debug logging for state changes
  useEffect(() => {
    console.log("PopupContent state:", {
      languageSupported,
      finalStateExecuted,
      article: !!article,
      fragmentData: !!fragmentData,
      loadingProgress,
      showLoader,
      detectedLanguage,
      showTranslationPrompt,
    });
  }, [
    languageSupported,
    finalStateExecuted,
    article,
    fragmentData,
    loadingProgress,
    showLoader,
    detectedLanguage,
    showTranslationPrompt,
  ]);

  useEffect(() => {
    // Hide loader only when we're ready to show final content OR we have an error state
    if (showLoader && finalStateExecuted && (languageSupported === false || !isReadable)) {
      setShowLoader(false);
    }
  }, [showLoader, finalStateExecuted, languageSupported, isReadable]);

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
    // Update detected language from parent
    if (passedDetectedLanguage) {
      setDetectedLanguage(passedDetectedLanguage);
    }
  }, [passedDetectedLanguage]);

  useEffect(() => {
    // Fetch learned language when user is available
    if (user && api && !learnedLanguage && sessionId) {
      // Ensure session is set
      if (!api.session) {
        api.session = sessionId;
      }

      api.getLearnedLanguage(
        (languageCode) => {
          setLearnedLanguage(languageCode);
        },
        (error) => {
          console.error("Failed to fetch learned language:", error);
          // Fallback to Danish as you mentioned
          setLearnedLanguage("da");
        },
      );
    }
  }, [user, api, learnedLanguage, sessionId]);

  useEffect(() => {
    // Check for translation prompt when detectedLanguage changes

    // Check if page language differs from user's learning language
    if (languageSupported === false && detectedLanguage && learnedLanguage && finalStateExecuted) {
      const supportedLanguages = ["de", "es", "fr", "nl", "en", "it", "da", "pl", "sv", "ru", "no", "hu", "pt", "ro"];

      // Show translation prompt if:
      // 1. Detected language is supported
      // 2. Detected language is different from user's learning language
      if (supportedLanguages.includes(detectedLanguage) && detectedLanguage !== learnedLanguage) {
        setShowTranslationPrompt(true);
      }
    }
  }, [detectedLanguage, languageSupported, learnedLanguage, finalStateExecuted]);

  useEffect(() => {
    // If languageSupported is already determined, set final state
    if (languageSupported !== undefined && !finalStateExecuted) {
      setFinalStateExecuted(true);

      // Check if we need to show translation prompt

      if (languageSupported === false && detectedLanguage && user?.learned_language) {
        // Check if the detected language is in the supported list
        const supportedLanguages = ["de", "es", "fr", "nl", "en", "it", "da", "pl", "sv", "ru", "no", "hu", "pt", "ro"];

        if (supportedLanguages.includes(detectedLanguage)) {
          // Language is translatable, show prompt

          setShowTranslationPrompt(true);
        }
      }
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
  }, [languageSupported, finalStateExecuted, isReadable, detectedLanguage, user]);

  async function openModal() {
    try {
      // Store URL and article data for the content script to access
      setCurrentURL(tab.url);
      await BROWSER_API.storage.local.set({
        articleData: article,
        fragmentData: fragmentData,
        sessionId: sessionId,
        url: tab.url,
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

  // Handle translation
  const handleTranslate = () => {
    setIsTranslating(true);
    setLoadingProgress("Translating and adapting article...");

    // Ensure session is set
    if (!api.session && sessionId) {
      api.session = sessionId;
    }

    api.translateAndAdaptArticle(
      tab.url,
      learnedLanguage || "en",
      (result) => {
        setTranslatedArticle(result);
        setTranslatedFragments(result);
        setShowTranslationPrompt(false);
        setIsTranslating(false);

        // Store translated data and open reader (same format as find_or_create_article)
        BROWSER_API.storage.local
          .set({
            articleData: result,
            fragmentData: result,
            sessionId: sessionId,
            url: tab.url,
          })
          .then(() => {
            openModal();
          });
      },
      (error) => {
        console.error("Translation failed:", error);
        setIsTranslating(false);
        setShowTranslationPrompt(false);
        // Just close the modal on error - user can try again
        window.close();
      },
    );
  };

  const handleCancelTranslation = () => {
    setShowTranslationPrompt(false);
    window.close();
  };

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

  // Show translation prompt if language is not supported but can be translated
  if (showTranslationPrompt && detectedLanguage) {
    const languageNames = {
      ro: "Romanian",
      en: "English",
      de: "German",
      es: "Spanish",
      fr: "French",
      nl: "Dutch",
      it: "Italian",
      da: "Danish",
      el: "Greek",
      pl: "Polish",
      sv: "Swedish",
      ru: "Russian",
      no: "Norwegian",
      hu: "Hungarian",
      pt: "Portuguese",
    };

    return (
      <>
        <HeadingContainer>
          <img src={logo} alt="Zeeguu logo" />
        </HeadingContainer>
        <TranslationPrompt
          detectedLanguage={languageNames[detectedLanguage] || detectedLanguage}
          learnedLanguage={languageNames[learnedLanguage] || learnedLanguage || "your learning language"}
          onTranslate={handleTranslate}
          onCancel={handleCancelTranslation}
          isTranslating={isTranslating}
        />
      </>
    );
  }

  if (!isReadable) {
    return renderFeedbackSection(READABILITY_FEEDBACK);
  } else if (
    languageSupported === false &&
    finalStateExecuted &&
    !showTranslationPrompt &&
    !translatedArticle &&
    !isTranslating
  ) {
    return renderFeedbackSection(LANGUAGE_FEEDBACK);
  } else if ((languageSupported && finalStateExecuted && article && fragmentData) || translatedArticle) {
    // Always show loading message before opening modal
    setTimeout(() => {
      openModal();
    }, 800); // Show message long enough to be visible
    return (
      <>
        <PopupLoading showLoader={true} setShowLoader={setShowLoader} loadingText="Opening article reader..." />
      </>
    );
  }

  return (
    <>
      <PopupLoading showLoader={showLoader} setShowLoader={setShowLoader} loadingText={loadingProgress} />
    </>
  );
}
