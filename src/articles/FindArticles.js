import React, { useState, useEffect } from "react";
import ArticlePreview from "./ArticlePreview";
import SortingButtons from "./SortingButtons";
import Interests from "./Interests";
import SearchField from "./SearchField";
import * as s from "./FindArticles.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Reminder from "./Reminder";
import ExtensionMessage from "../components/ExtensionMessage";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage";
import { isMobile } from "../utils/misc/mobileDetection";

/*global chrome*/
// (this will let our linter know we are accessing Chrome browser methods)

export default function NewArticles({ api }) {
  const [articleList, setArticleList] = useState(null);
  const [hasExtension, setHasExtension] = useState(false);
  const [isChrome, setIsChrome] = useState(false);
  const [extensionMessageOpen, setExtensionMessageOpen] = useState(false);
  const [displayedExtensionPopup, setDisplayedExtensionPopup] = useState(false);


  useEffect(() => {
    setDisplayedExtensionPopup(LocalStorage.displayedExtensionPopup());
    if (runningInChromeDesktop()) {
      setIsChrome(true);
      if (Feature.extension_experiment1() && !displayedExtensionPopup) {
        checkExtensionInstalled();
      }
    }
  }, []);

  function runningInChromeDesktop() {
    let userAgent = navigator.userAgent;
    return userAgent.match(/chrome|chromium|crios/i) && isMobile() === false;
  }

  function checkExtensionInstalled() {
    if (chrome.runtime) {
      chrome.runtime.sendMessage(
        process.env.REACT_APP_EXTENSION_ID,
        "You are on Zeeguu.org!",
        function (response) {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
          }
          if (response.message === true) {
            setHasExtension(true);
            console.log("Extension installed!");
          }
        }
      );
    } else {
      setHasExtension(false);
      setExtensionMessageOpen(true);
      console.log("No extension installed!");
    }
  }

  function handleCloseExtensionMessage() {
    setExtensionMessageOpen(false);
    setDisplayedExtensionPopup(true);
    LocalStorage.setDisplayedExtensionPopup(true);
  }

  var originalList = null;

  //on initial render
  if (articleList == null) {
    api.getUserArticles((articles) => {
      setArticleList(articles);
      originalList = [...articles];
    });

    setTitle(strings.findArticles);

    return <LoadingAnimation />;
  }
  //when the user changes interests...
  function articlesListShouldChange() {
    setArticleList(null);
    api.getUserArticles((articles) => {
      setArticleList(articles);
      originalList = [...articles];
    });
  }

  return (
    <>
      {!hasExtension && Feature.extension_experiment1() && !displayedExtensionPopup ? (
        <ExtensionMessage
          handleClose={handleCloseExtensionMessage}
          open={extensionMessageOpen}
        ></ExtensionMessage>
      ) : null}
      <s.MaterialSelection>
        <Interests
          api={api}
          articlesListShouldChange={articlesListShouldChange}
        />

        <SearchField />
      </s.MaterialSelection>
      <SortingButtons
        articleList={articleList}
        originalList={originalList}
        setArticleList={setArticleList}
      />
      <Reminder hasExtension={hasExtension} isChrome={isChrome}></Reminder>
      {articleList.map((each) => (
        <ArticlePreview key={each.id} article={each} api={api} />
      ))}
    </>
  );
}
