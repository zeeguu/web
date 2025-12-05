import { useContext, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";

import ArticlePreview from "./ArticlePreview";

import SortingButtons from "./SortingButtons";

import * as s from "../components/TopMessage.sc";
import { APIContext } from "../contexts/APIContext";
import useBrowsingSession from "../hooks/useBrowsingSession";

export default function BookmarkedArticles() {
  const api = useContext(APIContext);
  useBrowsingSession("bookmarked");
  const [articleList, setArticleList] = useState(null);

  let originalList = articleList;

  if (articleList == null) {
    api.getBookmarkedArticles((articles) => {
      setArticleList(articles);
    });

    setTitle("Bookmarked Articles");

    return <LoadingAnimation />;
  }

  if (articleList.length === 0) {
    return <s.YellowMessageBox>{strings.noBookmarksYet}</s.YellowMessageBox>;
  }

  return (
    <>
      <br />
      <br />
      <SortingButtons articleList={articleList} originalList={originalList} setArticleList={setArticleList} />
      {articleList.map((each) => (
        <ArticlePreview key={each.id} article={each} dontShowPublishingTime={true} />
      ))}
    </>
  );
}
