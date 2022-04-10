/*global chrome*/
import Login from "./Login";
import { checkReadability } from "./checkReadability";
import { getSourceAsDOM } from "./functions";
import { isProbablyReaderable } from "@mozilla/readability";
import logo from "../images/zeeguu128.png";
import { useState, useEffect } from "react";
import Zeeguu_API from "../../src/zeeguu-react/src/api/Zeeguu_API";
import {
  HeadingContainer,
  PopUp,
  BottomButton,
  BottomContainer,
  MiddleContainer,
} from "./Popup.styles";
import { Article } from "../JSInjection/Modal/Article";
import PopupLoading from "./PopupLoading";
import PopupContent from "./PopupContent";

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

  const [showLoader, setShowLoader] = useState(false);

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
  }, []);

  useEffect(() => {
    api.session = sessionId;
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
        api.session = sessionId;
        Article(tab.url).then((article) => {
          api.isArticleLanguageSupported(article.textContent, (result_dict) => {
            console.log(result_dict);
            if (result_dict === "NO") {
              setLanguageSupported(false);
            }
            if (result_dict === "YES") {
              setLanguageSupported(true);
            }
          });
        });
      }
    }
  }, [tab, sessionId]);

  // if we display the loader, display it for at least 800 ms
  useEffect(() => {
    if (showLoader === true) {
      let timer = setTimeout(() => {
        setShowLoader(false);
      }, 900);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [showLoader]);

  function handleSuccessfulSignIn(userInfo, session) {
    setUser({
      session: session,
      name: userInfo.name,
      learned_language: userInfo.learned_language,
      native_language: userInfo.native_language,
    });
    chrome.storage.local.set({ userInfo: userInfo });
    chrome.storage.local.set({ sessionId: session });
    setSessionId(session);
  }

  function handleSignOut(e) {
    e.preventDefault();
    setLoggedIn(false);
    setUser(null);
    chrome.storage.local.set({ loggedIn: false });
    chrome.storage.local.remove(["sessionId"]);
    chrome.storage.local.remove(["userInfo"]);
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
    if (user === undefined || isReadable === undefined || languageSupported === undefined || showLoader === true) {
      return (
        <PopUp>
          <PopupLoading
            showLoader={showLoader}
            setShowLoader={setShowLoader}
          ></PopupLoading>
        </PopUp>
      );
    }
    return (
      <PopUp>
        <HeadingContainer>
          <img src={logo} alt="Zeeguu logo" />
        </HeadingContainer>
        <MiddleContainer>
          <PopupContent
            isReadable={isReadable}
            languageSupported={languageSupported}
            user={user}
            tab={tab}
            api={api}
            sessionId={sessionId}
          ></PopupContent>
        </MiddleContainer>
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
