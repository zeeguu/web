import { useEffect, useState, useContext, useCallback } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";

import ArticlePreview from "./ArticlePreview";

import SortingButtons from "./SortingButtons";

import * as s from "../components/TopMessage.sc";
import { APIContext } from "../contexts/APIContext";
export default function RecommendedArticles() {
  const api = useContext(APIContext);
  const cachedArticles = api.getCachedRecommendedArticles();
  const [articleList, setArticleList] = useState(cachedArticles);
  const [originalList, setOriginalList] = useState(cachedArticles);

  // Functional updates: a card reports its hide only once its Undo toast closes,
  // so this can run with a stale list when several cards were hidden in a row.
  const handleArticleHidden = (articleId) => {
    setArticleList((list) => list.filter((item) => item.id !== articleId));
    setOriginalList((list) => (list ? list.filter((item) => item.id !== articleId) : list));
  };

  const fetchArticles = useCallback(() => {
    api.getRecommendedArticles((articles) => {
      setArticleList(articles);
      setOriginalList(articles);
    });
  }, [api]);

  useEffect(() => {
    setTitle("Recommended Articles");
    fetchArticles();
    // eslint-disable-next-line
  }, []);

  if (articleList == null) {
    return <LoadingAnimation />;
  }

  if (articleList.length === 0) {
    return <s.YellowMessageBox>{strings.noRecommendedArticles}</s.YellowMessageBox>;
  }

  return (
    <>
      <br />
      <br />
      <SortingButtons articleList={articleList} originalList={originalList} setArticleList={setArticleList} />
      {articleList.map((each) => (
        <ArticlePreview key={each.id} article={each} onArticleHidden={handleArticleHidden} />
      ))}
    </>
  );
}
