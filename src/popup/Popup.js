/*global chrome*/
import Login from "./Login";
import { checkReadability } from "./checkReadability";
import { setCurrentURL, getSourceAsDOM } from "./functions";
import { isProbablyReaderable } from "@mozilla/readability";
import logo from "../images/zeeguu128.png";
import { useState, useEffect } from "react";
import Zeeguu_API from "../../src/zeeguu-react/src/api/Zeeguu_API";


//for isProbablyReadable options object
const minLength = 120;
const minScore = 20;

export default function Popup({ loggedIn, setLoggedIn }) {
  let api = new Zeeguu_API("https://api.zeeguu.org");
  const [user, setUser] = useState();
  const [sessionId, setSession] = useState();
  const [name, setName] = useState();
  const [nativeLang, setNativeLang] = useState();

  useEffect(() => {
    chrome.storage.local.get("userInfo", function (result) {
      setUser(result.userInfo);
    });
  }, []);

  useEffect(() => {
    chrome.cookies.get({ url: "https://www.zeeguu.org", name: "name" }, 
    function (cookie) {
      if (cookie) {
        chrome.storage.local.set({ name: cookie.value}, () => console.log("name is set in local storage"))
        setName(cookie.value)
      }
    })
    
    chrome.cookies.get({ url: "https://www.zeeguu.org", name: "nativeLanguage" },
    function (cookie) {
      if (cookie) {
        chrome.storage.local.set({nativeLanguage: cookie.value}, () => {console.log("native lang is set in local storage")})
        setNativeLang(cookie.value)
      }
    })
  chrome.storage.local.get("sessionId", function (result) {
    if (result) {
      setSession(result.sessionId)
      console.log("sessionid", result.sessionId)
    }
    });
  }, [])

    useEffect(()=> {
      if (loggedIn) {
        let userInfo = {
            session: sessionId,
            name: name,
            learned_language: "en",
            native_language: nativeLang
        }
        console.log("userinfo,", userInfo) 
        handleSuccessfulSignIn(userInfo, sessionId)
      }
    }, [sessionId, name, nativeLang])

  async function openModal() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    //readability check
    const documentFromTab = getSourceAsDOM(tab.url);
    const isProbablyReadable = isProbablyReaderable(
      documentFromTab,
      minLength,
      minScore
    );
    const ownIsProbablyReadable = checkReadability(tab.url);

    if (!isProbablyReadable || !ownIsProbablyReadable) {
      return alert("This page is not readable");
    }
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["./main.js"],
      func: setCurrentURL(tab.url),
    });
    //window.close();
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
    chrome.cookies.remove(
      { url: "https://www.zeeguu.org", name: "sessionID" },
      () => console.log("Logged out, cookie removed")
    );
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
