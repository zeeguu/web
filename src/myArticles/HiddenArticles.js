import { useEffect, useState, useContext } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import { APIContext } from "../contexts/APIContext";
import { toast } from "react-toastify";

import ArticlePreview from "../articles/ArticlePreview";

import * as s from "../components/TopMessage.sc";

export default function HiddenArticles() {
  const api = useContext(APIContext);
  const [articleList, setArticleList] = useState(null);
  const [error, setError] = useState(null);

  const handleUnhideArticle = (articleId) => {
    api.unhideArticle(articleId, () => {
      const updatedList = articleList.filter((item) => item.id !== articleId);
      setArticleList(updatedList);
      toast.success(strings.articleRestored || "Article restored to your feed!");
    });
  };

  useEffect(() => {
    setTitle(strings.hidden + " - " + strings.myArticles);
    api.getHiddenUserArticles(0, (articles) => {
      setArticleList(articles);
    }, (err) => {
      setError(err);
      setArticleList([]);
    });
    // eslint-disable-next-line
  }, []);

  if (error) {
    return <s.YellowMessageBox>{strings.errorLoadingArticles || "Error loading articles. Please try again."}</s.YellowMessageBox>;
  }

  if (articleList == null) {
    return <LoadingAnimation />;
  }

  if (articleList.length === 0) {
    return <s.YellowMessageBox>{strings.noHiddenArticles}</s.YellowMessageBox>;
  }

  return (
    <>
      {articleList.map((each) => (
        <ArticlePreview
          key={each.id}
          article={each}
          dontShowSourceIcon={false}
          onUnhideArticle={handleUnhideArticle}
          isHiddenView={true}
        />
      ))}
    </>
  );
}
