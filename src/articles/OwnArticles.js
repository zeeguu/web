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
  const [articleList, setArticleList] = useState(null);
  const [originalList, setOriginalList] = useState(null);

  function updateOnPagination(newUpdatedList) {
    setArticleList(newUpdatedList);
    setOriginalList(newUpdatedList);
  }

  const [handleScroll, isWaitingForNewArticles, noMoreArticlesToShow] = useArticlePagination(
    articleList,
    updateOnPagination,
    "Saved Articles",
    (pageNumber, handleArticleInsertion) => {
      api.getSavedUserArticles(pageNumber, handleArticleInsertion);
    },
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

  if (articleList == null) {
    return <LoadingAnimation />;
  }

  if (articleList.length === 0) {
    return <s.YellowMessageBox>{strings.noOwnArticles}</s.YellowMessageBox>;
  }

  return (
    <>
      <SortingButtons articleList={articleList} originalList={originalList} setArticleList={setArticleList} />
      {articleList.map((each) => (
        <ArticlePreview key={each.id} article={each} dontShowSourceIcon={false} />
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
