/*global chrome*/
import { manualReadabilityCheck } from "./manualReadabilityCheck";
import { getUserInfo } from "./cookies";
import { useState, useEffect } from "react";
import Zeeguu_API from "../../../api/Zeeguu_API";
import { getSourceAsDOM } from "./functions";
import { isProbablyReaderable } from "@mozilla/readability";
import logo from "../../../../public/static/images/zeeguu128.png";
import { HeadingContainer, PopUp, BottomContainer } from "./Popup.styles";
import PopupContent from "./PopupContent";
import { EXTENSION_SOURCE } from "../constants";
import { checkLanguageSupport, setUserInLocalStorage } from "./functions";
import { StyledPrimaryButton } from "../InjectedReaderApp/Buttons.styles";
import { API_URL, WEB_URL } from "../../../config";
import { BROWSER_API } from "../utils/browserApi";

// for isProbablyReadable options object
const minLength = 120;
const minScore = 20;

export default function Popup({ loggedIn }) {
  let api = new Zeeguu_API(API_URL);

  const [user, setUser] = useState();
  const [tab, setTab] = useState();
  const [isReadable, setIsReadable] = useState();
  const [languageSupported, setLanguageSupported] = useState();
  const [articleData, setArticleData] = useState();
  const [fragmentData, setFragmentData] = useState();
  const [loadingProgress, setLoadingProgress] = useState("Analyzing page...");

  useEffect(() => {
    if (loggedIn) {
      getUserInfo(WEB_URL, setUser);
    }
  }, [loggedIn]);

  useEffect(() => {
    setUserInLocalStorage(user, api);
  }, [user]);

  useEffect(() => {
    BROWSER_API.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTab(tabs[0]);
    });
  }, []);

  useEffect(() => {
    if (tab !== undefined && user !== undefined) {
      api.session = user.session;
      api.logUserActivity(api.OPEN_POPUP, "", tab.url, EXTENSION_SOURCE);

      // Readability check and language check
      const documentFromTab = getSourceAsDOM(tab.url);
      const isProbablyReadable = isProbablyReaderable(documentFromTab, {
        minContentLength: minLength,
        minScore: minScore,
      });
      console.log(`Readability check for ${tab.url}:`, {
        isProbablyReadable,
        minLength,
        minScore,
      });
      const ownIsProbablyReadable = manualReadabilityCheck(tab.url);
      if (!isProbablyReadable || !ownIsProbablyReadable) {
        setIsReadable(false);
        setLanguageSupported(false);
      } else {
        setIsReadable(true);
        api.session = user.session;
        if (api.session !== undefined) {
          checkLanguageSupport(api, tab, setLanguageSupported, setArticleData, setLoadingProgress, setFragmentData);
        }
      }
    }
  }, [tab, user]);

  const openLogin = () => {
    window.open(WEB_URL + "/log_in", "_blank");
  };

  if (loggedIn === false) {
    return (
      <PopUp>
        <HeadingContainer>
          <img src={logo} alt="Zeeguu logo" />
        </HeadingContainer>
        <BottomContainer>
          <StyledPrimaryButton onClick={openLogin} name="toLogin" className="toLoginButton">
            Login
          </StyledPrimaryButton>
        </BottomContainer>
      </PopUp>
    );
  } else {
    if (user === undefined || isReadable === undefined) {
      return null;
    } else {
      return (
        <PopUp>
          <PopupContent
            isReadable={isReadable}
            languageSupported={languageSupported}
            user={user}
            tab={tab}
            api={api}
            sessionId={user.session}
            articleData={articleData}
            fragmentData={fragmentData}
            loadingProgress={loadingProgress}
          ></PopupContent>
        </PopUp>
      );
    }
  }
}
