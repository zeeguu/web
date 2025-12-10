import {useCallback, useEffect, useRef, useState} from "react";
import { getPixelsFromScrollBarToEnd } from "../utils/misc/getScrollLocation";
import { setTitle } from "../assorted/setTitle";

export default function useArticlePagination(
  articleList,
  setArticleList,
  pageTitle,
  getNewArticlesForPage,
  hiddenArticleIds,
) {
  const [isWaitingForNewArticles, setIsWaitingForNewArticles] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreArticlesToShow, setNoMoreArticlesToShow] = useState(false);
  const isWaitingRef = useRef(false);


  const stateRef = useRef({
    page: 0,
    finished: false,
    list: [],
  });

  useEffect(() => {
      stateRef.current = {
          page: currentPage,
          finished: noMoreArticlesToShow,
          list: articleList,
      };
  }, [currentPage, noMoreArticlesToShow, articleList]);

  async function loadArticles() {
    const s = stateRef.current;

    if (isWaitingRef.current || s.finished) return;
    isWaitingRef.current = true;

    const nextPage = s.page + 1;

    setIsWaitingForNewArticles(true);
    setTitle("Getting more articles...");

    try {
        const fetched = await new Promise((resolve) =>
            getNewArticlesForPage(nextPage, resolve)
        );

        const articles = fetched || [];

        if (articles.length === 0) {
            setNoMoreArticlesToShow(true);
            return;
        }
        // Deduplicate efficiently
        const existingIds = new Set(articleList.map(a => a.id));
        const hiddenIds = hiddenArticleIds || new Set();

        const uniqueArticles = articles.filter(
            a =>
                !existingIds.has(a.id) &&
                !hiddenIds.has(a.id) &&
                !a.has_personal_copy
        );

        const updatedList = [...articleList, ...uniqueArticles];
        if (updatedList.length === 0){
            console.log("list empty after filtering");
            await loadArticles();
        }
        setArticleList(updatedList);
        setCurrentPage(nextPage);
    } finally {
        isWaitingRef.current = false;
        setIsWaitingForNewArticles(false);
        setTitle(pageTitle);
    }
  }

    function loadNextPage() {
        return loadArticles();
    }

    const handleScroll = useCallback(() => {
        const s = stateRef.current;

        if (!s.list.length || s.isWaiting || s.finished) return;

        const pixelsLeft = getPixelsFromScrollBarToEnd();

        if (pixelsLeft <= 50) {
            loadArticles().then(() => {return true});
        }
    }, []);

  function resetPagination() {
        setIsWaitingForNewArticles(false);
        setNoMoreArticlesToShow(false);
        setCurrentPage(0);
        setArticleList([]);
    }

  return [
      handleScroll,
      isWaitingForNewArticles,
      noMoreArticlesToShow,
      resetPagination,
      loadNextPage,
  ];
}
