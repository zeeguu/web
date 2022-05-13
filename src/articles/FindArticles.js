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
import LocalStorage from "../assorted/LocalStorage";
import { runningInChromeDesktop } from "../utils/misc/browserDetection";
import { checkExtensionInstalled } from "../utils/misc/extensionCommunication";
import ShowLinkRecommendationsIfNoArticles from "./ShowLinkRecommendationsIfNoArticles";
import AudioExerciseMessage from "../components/AudioExerciseMessage.js";

export default function NewArticles({ api }) {
  const [articleList, setArticleList] = useState(null);
  const [originalList, setOriginalList] = useState(null);
  const [hasExtension, setHasExtension] = useState(true);
  const [extensionMessageOpen, setExtensionMessageOpen] = useState(false);
  const [displayedExtensionPopup, setDisplayedExtensionPopup] = useState(false);


  useEffect(() => {
    setDisplayedExtensionPopup(LocalStorage.displayedExtensionPopup());
    console.log("Running in chrome desktop: " + runningInChromeDesktop())
    console.log("Localstorage displayed extension: "+ LocalStorage.displayedExtensionPopup())

    if (runningInChromeDesktop()) {
      checkExtensionInstalled(setHasExtension);
    }
    
    // load articles
    api.getUserArticles((articles) => {
      setArticleList(articles);
      setOriginalList ([...articles]);
    });
    setTitle(strings.findArticles);

    }, []);

  useEffect(() => {
    if (!hasExtension) {
      setExtensionMessageOpen(true);
    }
  }, [hasExtension]);



  if (articleList == null) {
    return <LoadingAnimation />;
  }

  //when the user changes interests...
  function articlesListShouldChange() {
    setArticleList(null);
    api.getUserArticles((articles) => {
      setArticleList(articles);
      setOriginalList ([...articles]);
    });
  }

  return (
    <>
    <AudioExerciseMessage/>
      <ExtensionMessage
        open={extensionMessageOpen}
        hasExtension={hasExtension}
        displayedExtensionPopup={displayedExtensionPopup}
        setExtensionMessageOpen={setExtensionMessageOpen}
        setDisplayedExtensionPopup={setDisplayedExtensionPopup}
      ></ExtensionMessage>
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
      <Reminder hasExtension={hasExtension}></Reminder>
      {articleList.map((each) => (
        <ArticlePreview key={each.id} article={each} api={api} hasExtension={hasExtension}/>
      ))}
      <ShowLinkRecommendationsIfNoArticles
        articleList={articleList}
      ></ShowLinkRecommendationsIfNoArticles>
    </>
  );
}
