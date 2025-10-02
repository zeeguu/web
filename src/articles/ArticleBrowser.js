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

  // modal pref
  const doNotShowRedirectionModal_LocalStorage = LocalStorage.getDoNotShowRedirectionModal() === "true";
  const [doNotShowRedirectionModal_UserPreference, setDoNotShowRedirectionModal_UserPreference] = useState(
    doNotShowRedirectionModal_LocalStorage,
  );

  // exclude hidden and saved article from the homepage
  const shouldShow = (a) => ![true, "true"].includes(a?.hidden) && ![true, "true"].includes(a?.has_personal_copy);

  // pagination helpers
  function getNewArticlesForPage(pageNumber, handleArticleInsertion) {
    api.getMoreUserArticles(20, pageNumber, handleArticleInsertion, { excludeSaved: true });
  }

  function updateOnPagination(newUpdatedList) {
    const filtered = (newUpdatedList || []).filter(shouldShow);
    setArticlesAndVideosList(filtered);
  }

  const [handleScroll, isWaitingForNewArticles, noMoreArticlesToShow, resetPagination, loadNextPage] =
    useArticlePagination(
      articlesAndVideosList,
      updateOnPagination,
      strings.titleHome,
      getNewArticlesForPage,
      shouldShow,
    );

  const handleArticleClick = (articleId, sourceId, index) => {
    const seenList = articlesAndVideosList.slice(0, index).map((each) => each.source_id);
    const seenListAsString = JSON.stringify(seenList, null, 0);
    api.logUserActivity(api.CLICKED_ARTICLE, articleId, "", seenListAsString, sourceId);
  };

  const handleArticleHidden = (articleId) => {
    const updatedList = articlesAndVideosList.filter((item) => item.id !== articleId);
    setArticlesAndVideosList(updatedList);
    api.hideArticle(articleId, () => {
      // backend acknowledged → nothing else to do
    });
  };

  const handleArticleSave = (articleId, saved) => {
    setArticlesAndVideosList(
      (prev) =>
        prev?.map((e) => (e.id === articleId ? { ...e, has_personal_copy: saved } : e)).filter(shouldShow) ?? prev,
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
      onArticleClick={handleArticleClick}
      onArticleHidden={handleArticleHidden}
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
      onArticleClick={handleArticleClick}
      onArticleHidden={handleArticleHidden}
      onArticleSave={handleArticleSave}
      hasExtension={isExtensionAvailable}
      doNotShowRedirectionModal_UserPreference={doNotShowRedirectionModal_UserPreference}
      setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
    />
  );
}
