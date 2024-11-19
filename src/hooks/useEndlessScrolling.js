import { useState } from "react";
import { getPixelsFromScrollBarToEnd } from "../utils/misc/getScrollLocation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import useShadowRef from "./useShadowRef";
import { ADD_ACTIONS } from "../utils/endlessScrolling/add_actions";

export default function useEndlessScrolling(
  api,
  articleList,
  setArticleList,
  pageTitle,
  searchQuery,
  searchPublishPriority,
  searchDifficultyPriority,
) {
  // active session duration is measured in seconds
  // The DB stored the exercise time in ms we need to convert it
  // to MS.
  const [isWaitingForNewArticles, setIsWaitingForNewArticles] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreArticlesToShow, setNoMoreArticlesToShow] = useState(false);

  const noMoreArticlesToShowRef = useShadowRef(noMoreArticlesToShow);
  const isWaitingForNewArticlesRef = useShadowRef(isWaitingForNewArticles);
  const currentPageRef = useShadowRef(currentPage);
  const articleListRef = useShadowRef(articleList);

  function insertNewArticlesIntoArticleList(
    fetchedArticles,
    newCurrentPage,
    newArticles,
  ) {
    if (fetchedArticles.length === 0) {
      setNoMoreArticlesToShow(true);
    }
    newArticles = newArticles.concat(fetchedArticles);
    setArticleList(newArticles);
    setCurrentPage(newCurrentPage);
    setIsWaitingForNewArticles(false);
  }

  function handleScroll(action) {
    let scrollBarPixelDistToPageEnd = getPixelsFromScrollBarToEnd();
    let articlesHaveBeenFetched =
      currentPageRef.current !== undefined &&
      articleListRef.current !== undefined;

    if (
      scrollBarPixelDistToPageEnd <= 50 &&
      !isWaitingForNewArticlesRef.current &&
      !noMoreArticlesToShowRef.current &&
      articlesHaveBeenFetched
    ) {
      setIsWaitingForNewArticles(true);
      setTitle("Getting more articles...");

      let newCurrentPage = currentPageRef.current + 1;
      let newArticles = [...articleListRef.current];
      switch (action) {
        case action === ADD_ACTIONS.ADD_SAVED_ARTICLES:
          api.getSavedUserArticles(newCurrentPage, (articles) => {
            insertNewArticlesIntoArticleList(
              articles,
              newCurrentPage,
              newArticles,
            );
            setTitle(pageTitle);
          });
          break;
        case action === ADD_ACTIONS.ADD_RECOMMENDED_ARTICLES:
          api.getMoreUserArticles(20, newCurrentPage, (articles) => {
            insertNewArticlesIntoArticleList(
              articles,
              newCurrentPage,
              newArticles,
            );
            setTitle(strings.titleHome);
          });
          break;
        case action === ADD_ACTIONS.ADD_SEARCH_ARTICLES:
          api.searchMore(
            searchQuery,
            newCurrentPage,
            searchPublishPriority,
            searchDifficultyPriority,
            (articles) => {
              insertNewArticlesIntoArticleList(
                articles,
                newCurrentPage,
                newArticles,
              );
              setTitle(strings.titleSearch + ` '${searchQuery}'`);
            },
            (error) => {
              console.log("Failed to get searches!");
            },
          );
          break;
        default:
          console.warn(
            `Action used '${action}' is not defined, check function call.`,
          );
          break;
      }
    }
  }

  return [handleScroll, isWaitingForNewArticles, noMoreArticlesToShowRef];
}
