import { useEffect, useState } from "react";
import useShadowRef from "../hooks/useShadowRef";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import { getPixelsFromScrollBarToEnd } from "../utils/misc/getScrollLocation";

import ArticlePreview from "./ArticlePreview";

import SortingButtons from "./SortingButtons";

import * as s from "../components/TopMessage.sc";

export default function OwnArticles({ api }) {
  const [articleList, setArticleList] = useState(null);
  const [originalList, setOriginalList] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isWaitingForNewArticles, setIsWaitingForNewArticles] = useState(false);
  const [noMoreArticlesToShow, setNoMoreArticlesToShow] = useState(false);

  const articleListRef = useShadowRef(articleList);
  const currentPageRef = useShadowRef(currentPage);
  const noMoreArticlesToShowRef = useShadowRef(noMoreArticlesToShow);
  const isWaitingForNewArticlesRef = useShadowRef(isWaitingForNewArticles);

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

  function handleScroll() {
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
      api.getSavedUserArticles(newCurrentPage, (articles) => {
        insertNewArticlesIntoArticleList(articles, newCurrentPage, newArticles);
        setTitle("Saved Articles");
      });
    }
  }

  useEffect(() => {
    setTitle("Saved Articles");
    api.getSavedUserArticles(currentPage, (articles) => {
      setArticleList(articles);
      setOriginalList(articles);
    });
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  if (articleList == null) {
    return <LoadingAnimation />;
  }

  if (articleList.length === 0) {
    return <s.TopMessage>{strings.noOwnArticles}</s.TopMessage>;
  }

  return (
    <>
      <br />
      <br />
      <SortingButtons
        articleList={articleList}
        originalList={originalList}
        setArticleList={setArticleList}
      />
      {articleList.map((each) => (
        <ArticlePreview
          api={api}
          key={each.id}
          article={each}
          dontShowSourceIcon={true}
        />
      ))}
      {isWaitingForNewArticles && (
        <LoadingAnimation delay={0}></LoadingAnimation>
      )}
      {noMoreArticlesToShow && articleList.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            margin: "2em 0px",
          }}
        >
          There are no more saved articles.
        </div>
      )}
    </>
  );
}
