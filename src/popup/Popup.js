/*global chrome*/
import Login from "./Login"
import {getCurrentTab, reading, setCurrentURL} from "./functions";

export default function Popup() {  
  async function openModal(){
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reading(tab.url),
      files: ["./main.js"],
    });
    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["./modal.css"]
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setCurrentURL(tab.url),
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