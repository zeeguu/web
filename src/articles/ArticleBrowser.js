import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import useArticlePagination from "../hooks/useArticlePagination";
import strings from "../i18n/definitions";
import LoadingAnimation from "../components/LoadingAnimation";
import ArticleListBrowser from "./ArticleListBrowser";
import ArticleSwipeBrowser from "./ArticleSwipeBrowser";
import LocalStorage from "../assorted/LocalStorage";
import useExtensionCommunication from "../hooks/useExtensionCommunication";

export default function ArticleBrowser({
  isSwipeView = false,
}) {
  const api = useContext(APIContext);

  // UI and logic state
  const [articlesAndVideosList, setArticlesAndVideosList] = useState([]);
  const [isExtensionAvailable] = useExtensionCommunication();

    // The ternary operator below fix the problem with the getOpenArticleExternallyWithoutModal()
    // getter that was outputting undefined string values when they should be false
    // This occurs before the user selects their own preferences.
    // Additionally, the conditional statement needed to be tightened up due to JS's unstable behavior, which resulted
    // in bool values changing on its own on refresh without any other external trigger or preferences change.
    // A '=== "true"' clause has been added to the getters to achieve predictable and desired bool values.
  const doNotShowRedirectionModal_LocalStorage = LocalStorage.getDoNotShowRedirectionModal() === "true";
  const [doNotShowRedirectionModal_UserPreference, setDoNotShowRedirectionModal_UserPreference] = useState(
    doNotShowRedirectionModal_LocalStorage,
  );

  // pagination helpers
  function getNewArticlesForPage(pageNumber, handleArticleInsertion) {
    api.getMoreUserArticles(20, pageNumber, handleArticleInsertion, { excludeSaved: true });
  }

  function updateOnPagination(newUpdatedList) {
    const filtered = (newUpdatedList || []);
    setArticlesAndVideosList(filtered);
  }

  const [handleScroll, isWaitingForNewArticles, noMoreArticlesToShow, resetPagination, loadNextPage] =
    useArticlePagination(
      articlesAndVideosList,
      updateOnPagination,
      strings.titleHome,
      getNewArticlesForPage,
    );

  const handleArticleHide = (articleId) => {
    const updatedList = articlesAndVideosList.filter((item) => item.id !== articleId);
    setArticlesAndVideosList(updatedList);
    api.hideArticle(articleId, () => {
      // backend acknowledged → nothing else to do
    });
  };

  const handleArticleSave = (articleId, saved) => {
    setArticlesAndVideosList(
      (prev) =>
        prev?.map((e) => (e.id === articleId ? { ...e, has_personal_copy: saved } : e)) ?? prev,
    );
  };

  // persist user pref for redirection modal
  useEffect(() => {
    LocalStorage.setDoNotShowRedirectionModal(doNotShowRedirectionModal_UserPreference);
  }, [doNotShowRedirectionModal_UserPreference]);

  // always trigger first page for homepage
  useEffect(() => {
    loadNextPage();
  }, []);

  useEffect(() => {
    if (!isSwipeView) {
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      if (!isSwipeView) {
        window.removeEventListener("scroll", handleScroll, true);
      }
    };
  }, [handleScroll, isSwipeView]);

  if (articlesAndVideosList == null) return <LoadingAnimation />;

  return isSwipeView ? (
    <ArticleSwipeBrowser
      articles={articlesAndVideosList}
      onArticleHide={handleArticleHide}
      onArticleSave={handleArticleSave}
      loadNextPage={loadNextPage}
      isWaiting={isWaitingForNewArticles}
      noMore={noMoreArticlesToShow}
      hasExtension={isExtensionAvailable}
      doNotShowRedirectionModal_UserPreference={doNotShowRedirectionModal_UserPreference}
      setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
    />
  ) : (
    <ArticleListBrowser
      articles={articlesAndVideosList}
      setArticles={setArticlesAndVideosList}
      isWaiting={isWaitingForNewArticles}
      noMore={noMoreArticlesToShow}
      resetPagination={resetPagination}
      onArticleHide={handleArticleHide}
      onArticleSave={handleArticleSave}
      hasExtension={isExtensionAvailable}
      doNotShowRedirectionModal_UserPreference={doNotShowRedirectionModal_UserPreference}
      setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
    />
  );
}
