import { useEffect, useState, useContext } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";

import ArticlePreview from "./ArticlePreview";
import SortingButtons from "./SortingButtons";

import * as s from "../components/TopMessage.sc";
import useArticlePagination from "../hooks/useArticlePagination";

export default function OwnArticles() {
  const api = useContext(APIContext);
  const [articleList, setArticleList] = useState([]);
  const [originalList, setOriginalList] = useState([]);

  function updateOnPagination(newUpdatedList) {
    setArticleList(newUpdatedList);
    setOriginalList(newUpdatedList);
  }

  const handleArticleHidden = (articleId) => {
    const updatedList = articleList.filter((item) => item.id !== articleId);
    setArticleList(updatedList);
    if (originalList) {
      const updatedOriginalList = originalList.filter((item) => item.id !== articleId);
      setOriginalList(updatedOriginalList);
    }
  };

  const handleArticleSave = (articleId, saved) => {
    if (!saved) {
      setArticleList((prev) => (prev ? prev.filter((e) => String(e.id) !== String(articleId)) : prev));
      setOriginalList((prev) => (prev ? prev.filter((e) => String(e.id) !== String(articleId)) : prev));
    }
  };

  const [handleScroll, isWaitingForNewArticles, noMoreArticlesToShow] = useArticlePagination(
    articleList,
    updateOnPagination,
    "Saved Articles",
    (pageNumber, handleArticleInsertion) => {
      api.getSavedUserArticles(pageNumber, handleArticleInsertion);
    },
    { skipShouldShow: true },
  );

  useEffect(() => {
    setTitle("Saved Articles");
    api.getSavedUserArticles(0, (articles) => {
      setArticleList(articles);
      setOriginalList(articles);
    });
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
    // eslint-disable-next-line
  }, []);

  if (articleList == null || isWaitingForNewArticles || articleList.length === 0) {
    return <LoadingAnimation />;
  }

  if (articleList.length === 0 && !isWaitingForNewArticles) {
    return <s.YellowMessageBox>{strings.noOwnArticles}</s.YellowMessageBox>;
  }

  return (
    <>
      <SortingButtons articleList={articleList} originalList={originalList} setArticleList={setArticleList} />
      {articleList.map((each) => (
        <ArticlePreview
          key={each.id}
          article={each}
          dontShowSourceIcon={false}
          onArticleHidden={handleArticleHidden}
          onArticleSave={handleArticleSave}
        />
      ))}
      {isWaitingForNewArticles && <LoadingAnimation delay={0}></LoadingAnimation>}
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
