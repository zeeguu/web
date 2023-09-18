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
import {
  runningInChromeDesktop,
  runningInFirefoxDesktop,
} from "../utils/misc/browserDetection";
import { checkExtensionInstalled } from "../utils/misc/extensionCommunication";
import ShowLinkRecommendationsIfNoArticles from "./ShowLinkRecommendationsIfNoArticles";
import { useLocation } from "react-router-dom";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function NewArticles({ api }) {
  const searchQuery = useQuery().get("search");

  //The ternary operators below fix the problem with the getDoNotShowRedirectionNotificationModal()
  //and getOpenArticleExternallyWithoutModal() getters getters that were outputting undefined string
  //values when they should be false. This occurs before the user selects their own preferences.
  //Additionally, the conditional statement needed to be tightened up due to JS's unstable behavior, which resulted
  //in bool values changing on its own on refresh without any other external trigger or preferences change.
  // A '=== "true"' clause has been added to the getters to achieve predictable and desired bool values.
  const isDoNotShowRedirectionNotificationModaSelected_Checkbox =
    LocalStorage.getDoNotShowRedirectionNotificationModal_Checkbox() === "true"
      ? true
      : false;

  const isArticleOpenedExternallyWithoutModal =
    LocalStorage.getOpenArticleExternallyWithoutModal() === "true"
      ? true
      : false;

  const [articleList, setArticleList] = useState(null);
  const [originalList, setOriginalList] = useState(null);
  const [hasExtension, setHasExtension] = useState(true);
  const [extensionMessageOpen, setExtensionMessageOpen] = useState(false);
  const [displayedExtensionPopup, setDisplayedExtensionPopup] = useState(false);
  //States linked with the "Do not show" checkbox selection on the RedirectionNotificationModal
  const [
    selectedDoNotShowRedirectionModal_Checkbox,
    setSelectedDoNotShowRedirectionModal_Checkbox,
  ] = useState(isDoNotShowRedirectionNotificationModaSelected_Checkbox);
  //States controlling whether external articles should be opened with or without
  //the RedirectionNotificationModal
  const [
    doNotShowRedirectionModalUserPreference,
    setOpenedExternallyWithoutModal,
  ] = useState(isArticleOpenedExternallyWithoutModal);

  useEffect(() => {
    LocalStorage.setDoNotShowRedirectionNotificationModal_Checkbox(
      selectedDoNotShowRedirectionModal_Checkbox
    );
  }, [selectedDoNotShowRedirectionModal_Checkbox]);

  useEffect(() => {
    LocalStorage.setOpenArticleExternallyWithoutModal(
      doNotShowRedirectionModalUserPreference
    );
  }, [doNotShowRedirectionModalUserPreference]);

  useEffect(() => {
    setDisplayedExtensionPopup(LocalStorage.displayedExtensionPopup());
    console.log(
      "Localstorage displayed extension: " +
        LocalStorage.displayedExtensionPopup()
    );

    if (runningInChromeDesktop() || runningInFirefoxDesktop()) {
      checkExtensionInstalled(setHasExtension);
    }

    // load articles)
    if (searchQuery) {
      api.search(searchQuery, (articles) => {
        setArticleList(articles);
        setOriginalList([...articles]);
      });
    } else {
      api.getUserArticles((articles) => {
        setArticleList(articles);
        setOriginalList([...articles]);
      });
    }
    document.title = "Zeeguu";
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
      setOriginalList([...articles]);
    });
  }

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

        <SearchField query={searchQuery} />
      </s.MaterialSelection>

      <SortingButtons
        articleList={articleList}
        originalList={originalList}
        setArticleList={setArticleList}
      />
      <Reminder hasExtension={hasExtension}></Reminder>
      {articleList.map((each) => (
        <ArticlePreview
          key={each.id}
          article={each}
          api={api}
          hasExtension={hasExtension}
          doNotShowRedirectionModalUserPreference={
            doNotShowRedirectionModalUserPreference
          }
          setOpenedExternallyWithoutModal={setOpenedExternallyWithoutModal}
          selectedDoNotShowRedirectionModal_Checkbox={
            selectedDoNotShowRedirectionModal_Checkbox
          }
          setSelectedDoNotShowRedirectionModal_Checkbox={
            setSelectedDoNotShowRedirectionModal_Checkbox
          }
        />
      ))}

      {searchQuery && articleList.length === 0 && (
        <>No articles found that match your search</>
      )}

      {!searchQuery && (
        <ShowLinkRecommendationsIfNoArticles
          articleList={articleList}
        ></ShowLinkRecommendationsIfNoArticles>
      )}
    </>
  );
}
