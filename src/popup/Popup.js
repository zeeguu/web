import Login from "./Login"
import {getCurrentTab, reading} from "./functions";
/*global chrome*/

export default function Popup() {  
  async function openModal(){
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reading(tab.url),
      files: ["./content.js"],
    });
    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["./modal.css"]
  });
  }

  let currentTab = getCurrentTab();
  chrome.storage.local.set({ tabId: currentTab });
    return (
        <>
        <Login/>
        <button onClick={openModal}>Read article</button>
      </>
    );
  }