/*global chrome*/
import Login from "./Login";
import { checkReadability } from "./checkReadability";
import { setCurrentURL, getSourceAsDOM } from "./functions";
import { isProbablyReaderable } from "@mozilla/readability";
import logo from "../images/zeeguu128.png";
import { useState, useEffect } from "react";
import Zeeguu_API from "../../src/zeeguu-react/src/api/Zeeguu_API";
import {
  ButtonContainer,
  PopUpButton,
  HeadingContainer,
  PopUp,
  PopupButton,
  MiddleContainer,
  BottomContainer,
} from "./Popup.styles";

//for isProbablyReadable options object
const minLength = 120;
const minScore = 20;

export default function Popup({ loggedIn, setLoggedIn }) {
  let api = new Zeeguu_API("https://api.zeeguu.org");
  const [user, setUser] = useState();
  const [tab, setTab] = useState();
  const [isReadable, setIsReadable] = useState();

  useEffect(() => {
    chrome.storage.local.get("userInfo", function (result) {
      setUser(result.userInfo);
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTab(tabs[0]);
    });
  }, []);

  useEffect(() => {
    if (tab !== undefined) {
      //readability check
      const documentFromTab = getSourceAsDOM(tab.url);
      const isProbablyReadable = isProbablyReaderable(
        documentFromTab,
        minLength,
        minScore
      );
      const ownIsProbablyReadable = checkReadability(tab.url);

      if (!isProbablyReadable || !ownIsProbablyReadable) {
        setIsReadable(false);
      } else {
        setIsReadable(true);
      }
    }
  }, [tab]);

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
    if (user === undefined || isReadable === undefined) {
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
        <MiddleContainer>
          <p>{user ? <p>Welcome {user.name}</p> : null}</p>
          <ButtonContainer>
            {isReadable ? (
              <PopUpButton primary onClick={openModal}>
                Read article
              </PopUpButton>
            ) : (
              <PopUpButton disabled>Article not readable</PopUpButton>
            )}
          </ButtonContainer>
        </MiddleContainer>
        <BottomContainer>
          {!isReadable ? (
            <PopupButton onClick={() => alert("Create endpoint API")}>
              Should this be readable?
            </PopupButton>
          ) : null}
          <PopupButton onClick={handleSignOut}>Logout</PopupButton>
        </BottomContainer>
      </PopUp>
    );
  }
}
