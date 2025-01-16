import LocalStorage from "../assorted/LocalStorage";
import React, { useState, useEffect, useContext } from "react";
import ExtensionInstallationMessage from "./ExtensionInstallationMessage";
import { FEEDBACK_CODES_NAME } from "../components/FeedbackConstants";
import { APIContext } from "../contexts/APIContext";

export default function ShowLinkRecommendationsIfNoArticles({
  articleList,
  isExtensionAvailable,
}) {
  const api = useContext(APIContext);
  const [learnedLanguageCode, setLearnedLanguageCode] = useState(null);
  const [learnedLanguageName, setLearnedLanguageName] = useState(null);

  function sendFeedbackOnArticleNotFound(userInfo) {
    let payload = {
      message: `User did not find any articles to read for language '${userInfo.learned_language}'.`,
      feedbackComponentId: FEEDBACK_CODES_NAME.ARTICLE_READER,
      currentUrl: window.location.href,
    };
    api.sendFeedback(payload, () => {
      LocalStorage.setArticleNotFoundFeedbackSent(true);
    });
  }

  useEffect(() => {
    let userInfo = LocalStorage.userInfo();
    setLearnedLanguageCode(userInfo.learned_language);
    if (!LocalStorage.getArticleNotFoundFeedbackSent()) {
      sendFeedbackOnArticleNotFound(userInfo);
    }
  }, [api]);

  useEffect(() => {
    if (learnedLanguageCode === "pt" || learnedLanguageCode === "pt-br")
      setLearnedLanguageName("Portuguese");
    else if (learnedLanguageCode === "hu") setLearnedLanguageName("Hungarian");
    else if (learnedLanguageCode === "no") setLearnedLanguageName("Norwegian");
  }, [learnedLanguageCode]);

  if (articleList.length === 0 && learnedLanguageCode) {
    return (
      <>
        <p>
          You can still use our <b>Extension</b> to read articles on any
          website.
        </p>
        <ExtensionInstallationMessage
          hasExtension={isExtensionAvailable}
        ></ExtensionInstallationMessage>
        <p>
          Examples of some of the most popular news sites for{" "}
          <b>{learnedLanguageName}</b> are:
        </p>
        {(learnedLanguageCode === "pt" || learnedLanguageCode === "pt-br") && (
          <>
            <ul>
              <li>
                <a href="https://www.sapo.pt/" rel="noopener">
                  <p>sapo.pt</p>
                </a>
              </li>
              <li>
                <a href="https://cnnportugal.iol.pt/" rel="noopener">
                  <p>cnnportugal.iol.pt</p>
                </a>
              </li>
              <li>
                <a href="https://www.noticiasaominuto.com/" rel="noopener">
                  <p>noticiasaominuto.com</p>
                </a>
              </li>
              <li>
                <a href="https://abola.pt/" rel="noopener">
                  <p>abola.pt</p>
                </a>
              </li>
              <li>
                <a href="https://www.rtp.pt/noticias/" rel="noopener">
                  <p>rtp.pt</p>
                </a>
              </li>
              <li>
                <a href="https://www.cmjornal.pt/" rel="noopener">
                  <p>cmjornal.pt</p>
                </a>
              </li>
            </ul>
          </>
        )}
        {learnedLanguageCode === "hu" && (
          <>
            <ul>
              <li>
                <a href="https://index.hu/" rel="noopener">
                  <p>index.hu</p>
                </a>
              </li>
              <li>
                <a href="https://telex.hu/" rel="noopener">
                  <p>telex.hu</p>
                </a>
              </li>
              <li>
                <a href="https://24.hu/" rel="noopener">
                  <p>24.hu</p>
                </a>
              </li>
              <li>
                <a href="https://www.origo.hu/" rel="noopener">
                  <p>origo.hu</p>
                </a>
              </li>
            </ul>
          </>
        )}
        {learnedLanguageCode === "no" && (
          <>
            <ul>
              <li>
                <a href="https://www.vg.no/" rel="noopener">
                  <p>vg.no</p>
                </a>
              </li>
              <li>
                <a href="https://www.nrk.no/" rel="noopener">
                  <p>nrk.no</p>
                </a>
              </li>
              <li>
                <a href="https://www.dagbladet.no/" rel="noopener">
                  <p>dagbladet.no</p>
                </a>
              </li>
              <li>
                <a href="https://www.tv2.no/" rel="noopener">
                  <p>tv2.no</p>
                </a>
              </li>
            </ul>
          </>
        )}
      </>
    );
  } else {
    return null;
  }
}
