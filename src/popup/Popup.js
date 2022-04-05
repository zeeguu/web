/*global chrome*/
import Login from "./Login";
import { checkReadability } from "./checkReadability";
import { setCurrentURL, getSourceAsDOM} from "./functions";
import { isProbablyReaderable } from "@mozilla/readability";
import logo from "../images/zeeguu128.png";
import { useState, useEffect } from "react";
import Zeeguu_API from "../../src/zeeguu-react/src/api/Zeeguu_API";
import {
  ButtonContainer,
  PrimaryButton,
  HeadingContainer,
  PopUp,
  BottomButton,
  NotifyButton,
  BottomContainer,
  NotReadableContainer,
} from "./Popup.styles";
import { Article } from "../JSInjection/Modal/Article";
import sendFeedbackEmail from "../JSInjection/Modal/sendEmail"

//for isProbablyReadable options object
const minLength = 120;
const minScore = 20;

export default function Popup({ loggedIn, setLoggedIn }) {
  let api = new Zeeguu_API("https://api.zeeguu.org");
  const [user, setUser] = useState();
  const [tab, setTab] = useState();
  const [isReadable, setIsReadable] = useState();
  const [sessionId, setSessionId] = useState();
  const [languageSupported, setLanguageSupported] = useState();
  const [feedbackSent, setFeedbackSent] = useState(false);

  const LANGUAGE_FEEDBACK = "I want this language to be supported"
  const READABILITY_FEEDBACK = "I think this article should be readable"

  useEffect(() => {
    chrome.storage.local.get("userInfo", function (result) {
      setUser(result.userInfo);
    });
    chrome.storage.local.get("sessionId", function (result) {
      setSessionId(result.sessionId);
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTab(tabs[0]);
    });
    setFeedbackSent(false)
  }, []);

  useEffect(() => {
      api.session = sessionId
  }, [sessionId]);

  useEffect(() => {
    if (tab !== undefined && sessionId !== undefined) {
      // Readability check and language check
      const documentFromTab = getSourceAsDOM(tab.url);
      const isProbablyReadable = isProbablyReaderable(
        documentFromTab,
        minLength,
        minScore
      );
      const ownIsProbablyReadable = checkReadability(tab.url);
      if (!isProbablyReadable || !ownIsProbablyReadable) {
        setIsReadable(false);
        setLanguageSupported(false);
      } else {
        setIsReadable(true);
        api.session = sessionId
          Article(tab.url).then((article) => {
            api.isArticleLanguageSupported(
              article.textContent,
              (result_dict) => {
                console.log(result_dict);
                if (result_dict === "NO") {
                  setLanguageSupported(false);
                }
                if (result_dict === "YES") {
                  setLanguageSupported(true);
                }
              }
            );
          });
        
      }
    }
  }, [tab, sessionId]);

  async function openModal() {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["./main.js"],
      func: setCurrentURL(tab.url),
    });
    window.close();
  }

  function handleSuccessfulSignIn(userInfo, session) {
    setUser({
      session: session,
      name: userInfo.name,
      learned_language: userInfo.learned_language,
      native_language: userInfo.native_language,
    });
    chrome.storage.local.set({ userInfo: userInfo });
    chrome.storage.local.set({ sessionId: session });
    setSessionId(session)
  }

  function handleSignOut(e) {
    e.preventDefault();
    setLoggedIn(false);
    setUser(null);
    chrome.storage.local.set({ loggedIn: false });
    chrome.storage.local.remove(["sessionId"]);
    chrome.storage.local.remove(["userInfo"]);
  }

  function sendFeedback(feedback, url, articleId){
    sendFeedbackEmail(feedback, url, articleId)
    setFeedbackSent(true)
  }

  if (loggedIn === false) {
    return (
      <PopUp>
        <HeadingContainer>
          <img src={logo} alt="Zeeguu logo" />
        </HeadingContainer>
        <Login
          setLoggedIn={setLoggedIn}
          handleSuccessfulSignIn={handleSuccessfulSignIn}
          api={api}
        />
      </PopUp>
    );
  }

  if (loggedIn === true) {
    if (user === undefined || isReadable === undefined || languageSupported === undefined) {
      return (
        <PopUp>
          <div className="loader"></div>
        </PopUp>
      );
    }

    return (
      <PopUp>
        <HeadingContainer>
          <img src={logo} alt="Zeeguu logo" />
        </HeadingContainer>

        {user ? <p>Welcome {user.name}</p> : null}
        {isReadable === true && languageSupported === true && (
          <ButtonContainer>
            <PrimaryButton primary onClick={openModal}>
              Read article
            </PrimaryButton>
          </ButtonContainer>
        )}
        {isReadable === true && languageSupported === false && (
          <NotReadableContainer>
            <p>This article language is not supported</p>
            {!feedbackSent ? (
              <NotifyButton
                onClick={() =>sendFeedback(LANGUAGE_FEEDBACK, tab.url, undefined)}>
                Do you want us to support this?
              </NotifyButton>
            ) : (
              <NotifyButton disabled>Thanks for the feedback</NotifyButton>
            )}
          </NotReadableContainer>
        )}
        {isReadable === false && languageSupported === false && (
          <NotReadableContainer>
            <p>Zeeguu can't read this text. Try another one</p>
            {!feedbackSent ? (
              <NotifyButton
                onClick={() =>sendFeedback(READABILITY_FEEDBACK, tab.url, undefined)}>
                Should this be readable?
              </NotifyButton>
            ) : (
              <NotifyButton disabled>Thanks for the feedback</NotifyButton>
            )}
          </NotReadableContainer>
        )}
        <BottomContainer>
          <BottomButton
            onClick={() => window.open("https://zeeguu.org/account_settings", "_blank")}>
            Settings
          </BottomButton>
          <BottomButton onClick={handleSignOut}>Logout</BottomButton>
        </BottomContainer>
      </PopUp>
    );
  }
}
