import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";

import ArticlePreview from "./ArticlePreview";

import * as s from "../components/TopMessage.sc";
import { APIContext } from "../contexts/APIContext";
import useArticlePagination from "../hooks/useArticlePagination";

const PAGE_SIZE = 20;

const hiddenLinkStyle = {
  display: "block",
  textAlign: "right",
  fontSize: "0.9rem",
  margin: "0.5em 0 1em",
};

export default function BookmarkedArticles() {
  const api = useContext(APIContext);
  const [articleList, setArticleList] = useState(null);

  function getPage(pageNumber, callback) {
    api.getMoreBookmarkedArticles(PAGE_SIZE, pageNumber, callback);
  }

  const [handleScroll, isWaitingForNewArticles, noMoreArticlesToShow, resetPagination] = useArticlePagination(
    articleList,
    setArticleList,
    "Bookmarked Articles",
    getPage,
  );

  const fetchFirstPage = () =>
    new Promise((resolve) => {
      resetPagination();
      getPage(0, (articles) => {
        setArticleList(articles);
        resolve();
      });
    });

  useEffect(() => {
    setTitle("Bookmarked Articles");
    fetchFirstPage();
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
    // eslint-disable-next-line
  }, []);

  const hiddenLink = (
    <Link to="/articles/bookmarked/hidden" style={hiddenLinkStyle}>
      {strings.hidden} →
    </Link>
  );

  if (articleList == null) {
    return <LoadingAnimation />;
  }

  if (articleList.length === 0) {
    return (
      <PullToRefresh onRefresh={fetchFirstPage} pullingContent="">
        <s.YellowMessageBox>{strings.noBookmarksYet}</s.YellowMessageBox>
        {hiddenLink}
      </PullToRefresh>
    );
  }

  return (
    <PullToRefresh onRefresh={fetchFirstPage} pullingContent="">
      <>
        {articleList.map((each) => (
          <ArticlePreview
            key={each.id}
            article={each}
            dontShowPublishingTime={true}
            inSavedView={true}
          />
        ))}
        {isWaitingForNewArticles && <LoadingAnimation delay={0} />}
        {noMoreArticlesToShow && articleList.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              margin: "2em 0px",
            }}
          >
            There are no more results.
          </div>
        )}
        {hiddenLink}
      </>
    </PullToRefresh>
  );
}
