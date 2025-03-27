import { useState } from "react";
import { getPixelsFromScrollBarToEnd } from "../utils/misc/getScrollLocation";
import { setTitle } from "../assorted/setTitle";
import useShadowRef from "./useShadowRef";

export default function useArticlePagination(
  articleList,
  setArticleList,
  pageTitle,
  getNewArticlesForPage,
) {
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
    currentArticleList,
  ) {
    if (fetchedArticles.length === 0) {
      setNoMoreArticlesToShow(true);
    }
    let existingArticlesId = currentArticleList.map((each) => each.id);
    currentArticleList = currentArticleList.concat(
      fetchedArticles.filter((each) => !existingArticlesId.includes(each.id)),
    );
    setArticleList(currentArticleList);
    setCurrentPage(newCurrentPage);
    setIsWaitingForNewArticles(false);
  }

  function handleScroll() {
    if (!articleListRef.current) return;

    let scrollBarPixelDistToPageEnd = getPixelsFromScrollBarToEnd();

    let weHaveHadAtLeastOneRenderingOfArticles =
      currentPageRef.current !== undefined;

    if (
      scrollBarPixelDistToPageEnd <= 50 &&
      !isWaitingForNewArticlesRef.current &&
      !noMoreArticlesToShowRef.current &&
      weHaveHadAtLeastOneRenderingOfArticles
    ) {
      setIsWaitingForNewArticles(true);
      setTitle("Getting more articles...");

      let newCurrentPage = currentPageRef.current + 1;
      let articleListCopy = [...articleListRef.current];

      getNewArticlesForPage(newCurrentPage, (articles) => {
        insertNewArticlesIntoArticleList(
          articles,
          newCurrentPage,
          articleListCopy,
        );
        setTitle(pageTitle);
      });

      return true;
    }
  }

  function resetPagination() {
    setNoMoreArticlesToShow(false);
    setCurrentPage(0);
    setIsWaitingForNewArticles(false);
  }

  return [
    handleScroll,
    isWaitingForNewArticles,
    noMoreArticlesToShow,
    resetPagination,
  ];
}
