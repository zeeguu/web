import { useState } from "react";
import { getPixelsFromScrollBarToEnd } from "../utils/misc/getScrollLocation";
import { setTitle } from "../assorted/setTitle";
import useShadowRef from "./useShadowRef";

export default function useArticlePagination(
  articleList,
  setArticleList,
  pageTitle,
  getNewArticlesForPage,
  // While the whole feed is (re)loading its first page, the list is hidden and
  // the page collapses to almost nothing — which makes the scroll position read
  // as "at the bottom" and would trigger a bogus load-more (a second spinner and
  // a wasted page-2 fetch). Callers pass their feed-loading flag here to pause
  // infinite scroll until the first page is on screen. Optional: defaults off.
  isPaginationPaused = false,
) {
  const [isWaitingForNewArticles, setIsWaitingForNewArticles] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreArticlesToShow, setNoMoreArticlesToShow] = useState(false);

  const noMoreArticlesToShowRef = useShadowRef(noMoreArticlesToShow);
  const isWaitingForNewArticlesRef = useShadowRef(isWaitingForNewArticles);
  const currentPageRef = useShadowRef(currentPage);
  const articleListRef = useShadowRef(articleList);
  const isPaginationPausedRef = useShadowRef(isPaginationPaused);

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
      !isPaginationPausedRef.current &&
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
