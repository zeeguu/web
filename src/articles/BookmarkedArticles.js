import { useContext, useState } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";

import ArticlePreview from "./ArticlePreview";

import * as s from "../components/TopMessage.sc";
import { APIContext } from "../contexts/APIContext";
export default function BookmarkedArticles() {
  const api = useContext(APIContext);
  const [articleList, setArticleList] = useState(null);

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
      {articleList.map((each) => (
        <ArticlePreview
          key={each.id}
          article={each}
          dontShowPublishingTime={true}
          inSavedView={true}
        />
      ))}
    </>
  );
}
