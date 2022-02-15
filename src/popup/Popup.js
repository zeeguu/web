/*global chrome*/
import Login from "./Login";
import {
  getCurrentTab,
  reading,
  setCurrentURL,
  getSourceAsDOM,
} from "./functions";
import { isProbablyReaderable } from "@mozilla/readability";
import useState from "react";

//for isProbablyReadable options object
const minLength = 120;
const minScore = 20;

export default function Popup() {
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
      func: setCurrentURL(tab.url),
    });
  }

  let currentTab = getCurrentTab();
  chrome.storage.local.set({ tabId: currentTab });

  return (
    <>
      <Login />
      <button onClick={openModal}>Read article</button>
    </>
  );
}
