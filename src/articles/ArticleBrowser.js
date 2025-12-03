import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../contexts/APIContext";
import useArticlePagination from "../hooks/useArticlePagination";
import strings from "../i18n/definitions";
import LoadingAnimation from "../components/LoadingAnimation";
import ArticleListBrowser from "./ArticleListBrowser";
import ArticleSwipeBrowser from "./ArticleSwipeBrowser";
import LocalStorage from "../assorted/LocalStorage";
import useExtensionCommunication from "../hooks/useExtensionCommunication";
import {showSingleActionToast} from "./utils/showActionToast";

export default function ArticleBrowser({
  isSwipeView = false,
}) {
  const api = useContext(APIContext);

  // UI and logic state
  const [articlesAndVideosList, setArticlesAndVideosList] = useState([]);
  const [isExtensionAvailable] = useExtensionCommunication();
  const [hiddenArticleIds, setHiddenArticleIds] = useState(new Set());


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
    setArticlesAndVideosList(prev => [...prev, ...newUpdatedList]);
  }

  const [handleScroll, isWaitingForNewArticles, noMoreArticlesToShow, resetPagination, loadNextPage] =
    useArticlePagination(
      articlesAndVideosList,
      updateOnPagination,
      strings.titleHome,
      getNewArticlesForPage,
      hiddenArticleIds,
    );

    const handleArticleDismiss = (articleId) => {
        const oldList = [...articlesAndVideosList];
        const removedArticle = articlesAndVideosList.find(a => a.id === articleId);

        setArticlesAndVideosList(prev => prev.filter(a => a.id !== articleId));

        const duration = 3000;
        let undoClicked = false;

        setHiddenArticleIds(prev => {
            const newSet = new Set(prev);
            newSet.add(articleId);

            // Reset if too many hidden but keep current one
            if (newSet.size > 10) return new Set([articleId]);
            return newSet;
        });

        // Set a timer to finalize hiding when user does not undo
        const timer = setTimeout(() => {
            if (!undoClicked && removedArticle) api.hideArticle(articleId, () => {});
        }, duration);

        if (hiddenArticleIds.size > 10)setHiddenArticleIds(new Set());

        showSingleActionToast(
            "Article hidden",
            () => {
                undoClicked = true;
                clearTimeout(timer);
                onClickUndo(removedArticle, oldList, articleId);
                },
            duration
        );
    };

    const onClickUndo = (removedArticle, oldList, articleId) => {
        if (!removedArticle) return;

        // Restore the article at its original position
        setArticlesAndVideosList(prev => {
            const index = oldList.findIndex(a => a.id === articleId);
            const newList = [...prev];
            newList.splice(index, 0, removedArticle);
            return newList;
        });

        // Remove from hidden set
        setHiddenArticleIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(articleId);
            return newSet;
        });
    }


    const handleArticleSave = (articleId, saved) => {
    setArticlesAndVideosList(
      (prev) =>
          prev?.reduce((acc, article) => {
              if (article.id === articleId) {
                  article = { ...article, has_personal_copy: saved };
              }
              if (![true, "true"].includes(article.has_personal_copy)) {
                  acc.push(article);
              }
              return acc;
          }, []) ?? prev    );
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
      onArticleHide={handleArticleDismiss}
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
      onArticleHide={handleArticleDismiss}
      onArticleSave={handleArticleSave}
      hasExtension={isExtensionAvailable}
      doNotShowRedirectionModal_UserPreference={doNotShowRedirectionModal_UserPreference}
      setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
    />
  );
}
