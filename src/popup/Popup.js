/*global chrome*/
import Login from "./Login";
import { checkReadability} from "./checkReadability";
import {setCurrentURL, getSourceAsDOM} from "./functions";
import { isProbablyReaderable } from "@mozilla/readability";
import logo from "../images/zeeguu128.png";
import { useState, useEffect } from "react";
import Zeeguu_API from "../../src/zeeguu-react/src/api/Zeeguu_API"

//for isProbablyReadable options object
const minLength = 120;
const minScore = 20;

export default function Popup({ loggedIn, setLoggedIn }) {
  let api = new Zeeguu_API("https://api.zeeguu.org");
  const [user, setUser] = useState();

  useEffect(() => {
    chrome.storage.local.get("userInfo", function (result) {
      setUser(result.userInfo);
    });
  }, []);

  async function openModal() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    //readability check
    const documentFromTab = getSourceAsDOM(tab.url);
    const isProbablyReadable = isProbablyReaderable(
      documentFromTab,
      minLength,
      minScore
    );
    const ownIsProbablyReadable = checkReadability(tab.url)

    if (!isProbablyReadable || !ownIsProbablyReadable) {
      return alert("This page is not readable");
    }

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

  return (
    <>
      <div class="imgcontainer">
        <img src={logo} alt="Zeeguu logo" class="logo" />
      </div>
      {loggedIn === false && (
        <Login
          setLoggedIn={setLoggedIn}
          handleSuccessfulSignIn={handleSuccessfulSignIn}
          api={api}
        />
      )}
      {loggedIn === true && (
        <>
          <p>{user ? <p>Welcome {user.name}</p> : null}</p>
          <button onClick={openModal}>Read article</button>
          <button onClick={handleSignOut}>Logout</button>
        </>
      )}
    </>
  );
}
