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
import AudioExerciseMessage from "../components/AudioExerciseMessage";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage";
import { runningInChromeDesktop } from "../utils/misc/browserDetection";
import { checkExtensionInstalled } from "../utils/misc/extensionCommunication";
import ShowLinkRecommendationsIfNoArticles from "./ShowLinkRecommendationsIfNoArticles";


export default function NewArticles({ api }) {
  const [articleList, setArticleList] = useState(null);
  const [hasExtension, setHasExtension] = useState(true);
  const [extensionMessageOpen, setExtensionMessageOpen] = useState(false);
  const [displayedExtensionPopup, setDisplayedExtensionPopup] = useState(false);

  const [AudioExerciseMessageOpen, setAudioExerciseMessageOpen] = useState(true);
  const [displayedAudioExercisePopup, setDisplayedAudioExercisePopup] = useState(false);

  useEffect(() => {
    setDisplayedExtensionPopup(LocalStorage.displayedExtensionPopup());
    console.log("Running in chrome desktop: " + runningInChromeDesktop())
    console.log("Localstorage displayed extension: "+ LocalStorage.displayedExtensionPopup())
    if (runningInChromeDesktop() && Feature.extension_experiment1() && !displayedExtensionPopup) {
      checkExtensionInstalled(setHasExtension);
    }
    console.log("Localstorage displayed audio popup: "+ LocalStorage.displayedAudioExercisePopup)
  }, []);

  useEffect(() => {
    if (!hasExtension) {
      setExtensionMessageOpen(true);
    }
  }, [hasExtension]);


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
      <AudioExerciseMessage
      open={AudioExerciseMessageOpen}
      displayedAudioExercisePopup={displayedAudioExercisePopup}
      setAudioExerciseMessageOpen={setAudioExerciseMessageOpen}
      setDisplayedAudioExercisePopup = {setDisplayedAudioExercisePopup}
      >
        
      </AudioExerciseMessage>
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
        <ArticlePreview key={each.id} article={each} api={api} />
      ))}
      <ShowLinkRecommendationsIfNoArticles articleList={articleList}></ShowLinkRecommendationsIfNoArticles>
    </>
  );
}
