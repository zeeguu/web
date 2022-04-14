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
import { runningInChromeDesktop } from "../utils/misc/browserDetection";
import { checkExtensionInstalled } from "../utils/misc/extensionCommunication";
import { articlesInLanguage } from "./articleLanguages";
import Newssites from "./Newssites";

export default function NewArticles({ api }) {
  const [articleList, setArticleList] = useState(null);
  const [hasExtension, setHasExtension] = useState(true);
  const [learnedLanguage, setLearnedLanguage] = useState(null);
  const [extensionMessageOpen, setExtensionMessageOpen] = useState(false);
  const [displayedExtensionPopup, setDisplayedExtensionPopup] = useState(false);

  useEffect(() => {
    setDisplayedExtensionPopup(LocalStorage.displayedExtensionPopup());
    if (runningInChromeDesktop() && Feature.extension_experiment1() && !displayedExtensionPopup) {
      checkExtensionInstalled(setHasExtension);
    }
  }, []);

  useEffect(() => {
    let userInfo = LocalStorage.userInfo()
    let learned = userInfo.learned_language
    setLearnedLanguage(learned)
  }, []);

  useEffect(() => {
    if (!hasExtension) {
      setExtensionMessageOpen(true);
    }
  }, [hasExtension]);


  var originalList = null;

  //on initial render

  if (articleList == null && !articlesInLanguage(learnedLanguage)) {
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
  console.log(articlesInLanguage())

  return (
    <>
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
      <Reminder hasExtension={hasExtension} ></Reminder>
      {!articlesInLanguage(learnedLanguage) ? (
      articleList.map((each) => (
        <ArticlePreview key={each.id} article={each} api={api} />
      ))
      ): <>
      <p> We have not collected articles in the language you want to study. But you browse the web and use the extension to read articles. You can for example go to some of the most popular newssite:</p>
      <Newssites learnedLanguage={learnedLanguage}></Newssites>
      </>
      }
    </>
  );
}
