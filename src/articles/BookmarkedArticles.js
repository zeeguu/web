import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";

import ArticlePreview from "./ArticlePreview";

import * as s from "../components/TopMessage.sc";
import { APIContext } from "../contexts/APIContext";

const hiddenLinkStyle = {
  display: "block",
  textAlign: "right",
  fontSize: "0.9rem",
  margin: "0.5em 0 1em",
};

export default function BookmarkedArticles() {
  const api = useContext(APIContext);
  const [articleList, setArticleList] = useState(null);

  const fetchBookmarked = () =>
    new Promise((resolve) => {
      api.getBookmarkedArticles((articles) => {
        setArticleList(articles);
        resolve();
      });
    });

  const hiddenLink = (
    <Link to="/articles/bookmarked/hidden" style={hiddenLinkStyle}>
      {strings.hidden} →
    </Link>
  );

  if (articleList == null) {
    fetchBookmarked();
    setTitle("Bookmarked Articles");
    return <LoadingAnimation />;
  }

  if (articleList.length === 0) {
    return (
      <PullToRefresh onRefresh={fetchBookmarked} pullingContent="">
        <s.YellowMessageBox>{strings.noBookmarksYet}</s.YellowMessageBox>
        {hiddenLink}
      </PullToRefresh>
    );
  }

  return (
    <PullToRefresh onRefresh={fetchBookmarked} pullingContent="">
      <>
        {articleList.map((each) => (
          <ArticlePreview
            key={each.id}
            article={each}
            dontShowPublishingTime={true}
            inSavedView={true}
          />
        ))}
        {hiddenLink}
      </>
    </PullToRefresh>
  );
}
