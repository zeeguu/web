import { useState } from "react";
import { getPixelsFromScrollBarToEnd } from "../utils/misc/getScrollLocation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import useShadowRef from "./useShadowRef";
import { ADD_ARTICLE_ACTION } from "../utils/articlePagination/add_actions";

export default function useArticlePagination(
  api,
  articleList,
  setArticleList,
  pageTitle,
  action,
  searchQuery,
  searchPublishPriority,
  searchDifficultyPriority,
) {
  const [isWaitingForNewArticles, setIsWaitingForNewArticles] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreArticlesToShow, setNoMoreArticlesToShow] = useState(false);

  const noMoreArticlesToShowRef = useShadowRef(noMoreArticlesToShow);
  const isWaitingForNewArticlesRef = useShadowRef(isWaitingForNewArticles);
  const currentPageRef = useShadowRef(currentPage);
  const articleListRef = useShadowRef(articleList);
  const searchPublishPriorityRef = useShadowRef(searchPublishPriority);
  const searchDifficultyPriorityRef = useShadowRef(searchDifficultyPriority);

  function insertNewArticlesIntoArticleList(
    fetchedArticles,
    newCurrentPage,
    newArticles,
  ) {
    if (fetchedArticles.length === 0) {
      setNoMoreArticlesToShow(true);
    }
    let existingArticlesId = newArticles.map((each) => each.id);
    newArticles = newArticles.concat(
      fetchedArticles.filter((each) => !existingArticlesId.includes(each.id)),
    );
    setArticleList(newArticles);
    setCurrentPage(newCurrentPage);
    setIsWaitingForNewArticles(false);
  }

  function handleScroll() {
    if (!articleListRef.current) return;
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
        case ADD_ARTICLE_ACTION.SAVED_ARTICLES:
          api.getSavedUserArticles(newCurrentPage, (articles) => {
            insertNewArticlesIntoArticleList(
              articles,
              newCurrentPage,
              newArticles,
            );
            setTitle(pageTitle);
          });
          break;
        case ADD_ARTICLE_ACTION.RECOMMENDED_ARTICLES:
          api.getMoreUserArticles(20, newCurrentPage, (articles) => {
            insertNewArticlesIntoArticleList(
              articles,
              newCurrentPage,
              newArticles,
            );
            setTitle(strings.titleHome);
          });
          break;
        case ADD_ARTICLE_ACTION.SEARCH_ARTICLES:
          api.searchMore(
            searchQuery,
            newCurrentPage,
            searchPublishPriorityRef.current,
            searchDifficultyPriorityRef.current,
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
              console.error(error);
            },
          );
          break;
        default:
          console.error(
            `Action used '${action}' is not defined, check function call.`,
          );
          break;
      }
    }
  }

  function resetScrolling() {
    setNoMoreArticlesToShow(false);
    setCurrentPage(0);
    setIsWaitingForNewArticles(false);
  }

  return [
    handleScroll,
    isWaitingForNewArticles,
    noMoreArticlesToShow,
    resetScrolling,
  ];
}
