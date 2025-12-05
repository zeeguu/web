import { useEffect, useState, useContext } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";

import ArticlePreview from "./ArticlePreview";

import SortingButtons from "./SortingButtons";

import * as s from "../components/TopMessage.sc";
import { APIContext } from "../contexts/APIContext";
import useBrowsingSession from "../hooks/useBrowsingSession";

export default function RecommendedArticles() {
  const api = useContext(APIContext);
  useBrowsingSession("recommended");
  const [articleList, setArticleList] = useState(null);
  const [originalList, setOriginalList] = useState(null);

  const handleArticleHidden = (articleId) => {
    const updatedList = articleList.filter((item) => item.id !== articleId);
    setArticleList(updatedList);
    if (originalList) {
      const updatedOriginalList = originalList.filter((item) => item.id !== articleId);
      setOriginalList(updatedOriginalList);
    }
  };

  useEffect(() => {
    setTitle("Recommended Articles");

    api.getRecommendedArticles((articles) => {
      setArticleList(articles);
      setOriginalList(articles);
    });
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
        <ArticlePreview key={each.id} article={each} dontShowSourceIcon={true} onArticleHidden={handleArticleHidden} />
      ))}
    </>
  );
}
