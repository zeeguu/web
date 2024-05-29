import React, { useState, useEffect, useContext } from "react";
import useShadowRef from "../hooks/useShadowRef";
import ArticlePreview from "./ArticlePreview";
import SortingButtons from "./SortingButtons";
import Interests from "./Interests";
import SearchField from "./SearchField";
import * as s from "./FindArticles.sc";
import LoadingAnimation from "../components/LoadingAnimation";

import ExtensionMessage from "./ExtensionMessage";
import LocalStorage from "../assorted/LocalStorage";

import ShowLinkRecommendationsIfNoArticles from "./ShowLinkRecommendationsIfNoArticles";
import { useLocation } from "react-router-dom";
import { APIContext } from "../contexts/APIContext";
import useExtensionCommunication from "../hooks/useExtensionCommunication";
import { getPixelsFromScrollBarToEnd } from "../utils/misc/getScrollLocation";
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

  const [articleList, setArticleList] = useState();
  const [originalList, setOriginalList] = useState(null);
  const [isExtensionAvailable] = useExtensionCommunication();
  const [extensionMessageOpen, setExtensionMessageOpen] = useState(false);
  const [displayedExtensionPopup, setDisplayedExtensionPopup] = useState(false);
  const [
    doNotShowRedirectionModal_UserPreference,
    setDoNotShowRedirectionModal_UserPreference,
  ] = useState(doNotShowRedirectionModal_LocalStorage);
  const [isWaitingForNewArticles, setIsWaitingForNewArticles] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const articleListRef = useShadowRef(articleList);
  const currentPageRef = useShadowRef(currentPage);
  const isWaitingForNewArticlesRef = useShadowRef(isWaitingForNewArticles);
  console.log(articleList);
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

  function handleScroll() {
    let pixelsFromPageEnd = getPixelsFromScrollBarToEnd();
    if (pixelsFromPageEnd <= 50 && !isWaitingForNewArticlesRef.current) {
      setIsWaitingForNewArticles(true);
      let newCurrentPage = currentPageRef.current + 1;
      let newArticles = [...articleListRef.current];
      insertNewArticlesIntoArticleList(newCurrentPage, newArticles);
    }
  }

  function insertNewArticlesIntoArticleList(newCurrentPage, newArticles) {
    if (searchQuery) {
      api.searchMore(searchQuery, newCurrentPage, (articles) => {
        newArticles = newArticles.concat(articles);
        setArticleList(newArticles);
        setOriginalList([...newArticles]);
        setCurrentPage(newCurrentPage);
        setIsWaitingForNewArticles(false);
      });
    } else {
      api.getMoreUserArticles(20, newCurrentPage, (articles) => {
        newArticles = newArticles.concat(articles);
        setArticleList(newArticles);
        setOriginalList([...newArticles]);
        setCurrentPage(newCurrentPage);
        setIsWaitingForNewArticles(false);
      });
    }
  }

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
    window.addEventListener("scroll", handleScroll, true);
    document.title = "Zeeguu";
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  useEffect(() => {
    if (!isExtensionAvailable) {
      setExtensionMessageOpen(true);
    }
  }, [isExtensionAvailable]);

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
        hasExtension={isExtensionAvailable}
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
      {articleList.map((each, index) => (
        <ArticlePreview
          key={each.id}
          article={each}
          api={api}
          hasExtension={isExtensionAvailable}
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
      {isWaitingForNewArticles && (
        <LoadingAnimation delay={0}></LoadingAnimation>
      )}
    </>
  );
}
