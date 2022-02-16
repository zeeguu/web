/*global chrome*/
import Login from "./Login";
import {
  getCurrentTab,
  setCurrentURL,
  getSourceAsDOM,
} from "./functions";
import { isProbablyReaderable } from "@mozilla/readability";
import logo from "../images/zeeguu128.png";

//for isProbablyReadable options object
const minLength = 120;
const minScore = 20;

export default function Popup({loggedIn, setLoggedIn}) {

  async function openModal() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    //readability check
    const documentFromTab = getSourceAsDOM(tab.url);
    const isProbablyReadable = isProbablyReaderable(
      documentFromTab,
      minLength,
      minScore
    );
    if (!isProbablyReadable) {
      return alert("This page is not readable");
    }
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      //function: reading(tab.url),
      files: ["./main.js"],
    });
    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["./modal.css"],
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setCurrentURL(tab.url),
    });
  }

  let currentTab = getCurrentTab();
  chrome.storage.local.set({ tabId: currentTab });

  function handleSignOut(e){
    e.preventDefault();
    chrome.storage.local.set({ loggedIn: false });
    setLoggedIn(false)
  }

  return (
    <>
      <div class="imgcontainer">
        <img src={logo} alt="Zeeguu logo" class="logo" />
      </div>
      {loggedIn === false && <Login setLoggedIn={setLoggedIn} />}
      {loggedIn === true && (
        <>
          <button onClick={openModal}>Read article</button>
          <button onClick={handleSignOut}>Logout</button>
        </>
      )}
    </>
  );
}
