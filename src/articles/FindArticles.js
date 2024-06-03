import React, { useState, useEffect, useContext } from "react";
import ArticlePreview from "./ArticlePreview";
import SortingButtons from "./SortingButtons";
import Interests from "./Interests";
import SearchField from "./SearchField";
import * as s from "./FindArticles.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import Reminder from "./Reminder";
import ExtensionMessage from "./ExtensionMessage";
import LocalStorage from "../assorted/LocalStorage";
import {
  runningInChromeDesktop,
  runningInFirefoxDesktop,
} from "../utils/misc/browserDetection";
import { checkExtensionInstalled } from "../utils/misc/extensionCommunication";
import ShowLinkRecommendationsIfNoArticles from "./ShowLinkRecommendationsIfNoArticles";
import { useLocation } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function NewArticles() {
  const searchQuery = useQuery().get("search");
  let api = useContext(APIContext);

  //The ternary operator below fix the problem with the getOpenArticleExternallyWithoutModal()
  //getter that was outputting undefined string values when they should be false.
  //This occurs before the user selects their own preferences.
  //Additionally, the conditional statement needed to be tightened up due to JS's unstable behavior, which resulted
  //in bool values changing on its own on refresh without any other external trigger or preferences change.
  // A '=== "true"' clause has been added to the getters to achieve predictable and desired bool values.
  const doNotShowRedirectionModal_LocalStorage =
    LocalStorage.getDoNotShowRedirectionModal() === "true" ? true : false;

  const [articleList, setArticleList] = useState(null);
  const [originalList, setOriginalList] = useState(null);
  const [hasExtension, setHasExtension] = useState(true);
  const [extensionMessageOpen, setExtensionMessageOpen] = useState(false);
  const [displayedExtensionPopup, setDisplayedExtensionPopup] = useState(false);
  const [
    doNotShowRedirectionModal_UserPreference,
    setDoNotShowRedirectionModal_UserPreference,
  ] = useState(doNotShowRedirectionModal_LocalStorage);

  const handleArticleClick = (articleId, index) => {
    const articleSeenList = articleList
      .slice(0, index)
      .map((article) => article.id);
    const articleSeenListString = JSON.stringify(articleSeenList, null, 0);
    api.logUserActivity(
      api.CLICKED_ARTICLE,
      articleId,
      "",
      articleSeenListString,
    );
  };

  useEffect(() => {
    LocalStorage.setDoNotShowRedirectionModal(
      doNotShowRedirectionModal_UserPreference,
    );
  }, [doNotShowRedirectionModal_UserPreference]);

  useEffect(() => {
    setDisplayedExtensionPopup(LocalStorage.displayedExtensionPopup());
    console.log(
      "Localstorage displayed extension: " +
        LocalStorage.displayedExtensionPopup(),
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

        <SearchField api={api} query={searchQuery} />
      </s.MaterialSelection>

      <SortingButtons
        articleList={articleList}
        originalList={originalList}
        setArticleList={setArticleList}
      />
      <Reminder hasExtension={hasExtension}></Reminder>
      {articleList.map((each, index) => (
        <ArticlePreview
          key={each.id}
          article={each}
          api={api}
          hasExtension={hasExtension}
          doNotShowRedirectionModal_UserPreference={
            doNotShowRedirectionModal_UserPreference
          }
          setDoNotShowRedirectionModal_UserPreference={
            setDoNotShowRedirectionModal_UserPreference
          }
          onArticleClick={() => handleArticleClick(each.id, index)}
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
