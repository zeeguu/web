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

  const handleUnhideArticle = (articleId) => {
    api.unhideArticle(articleId, () => {
      const updatedList = articleList.filter((item) => item.id !== articleId);
      setArticleList(updatedList);
      toast.success("Article restored to your feed!");
    });
  };

  useEffect(() => {
    setTitle(strings.hidden + " - " + strings.myArticles);
    api.getHiddenUserArticles(0, (articles) => {
      setArticleList(articles);
    });
    // eslint-disable-next-line
  }, []);

  if (articleList == null) {
    return <LoadingAnimation />;
  }

  if (articleList.length === 0) {
    return <s.YellowMessageBox>You have no hidden articles.</s.YellowMessageBox>;
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
