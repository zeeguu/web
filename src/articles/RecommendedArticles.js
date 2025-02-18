import { useEffect, useState, useContext } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";

import ArticlePreview from "./ArticlePreview";

import SortingButtons from "./SortingButtons";

import * as s from "../components/TopMessage.sc";
import { APIContext } from "../contexts/APIContext";

export default function RecommendedArticles() {
  const api = useContext(APIContext);
  const [articleList, setArticleList] = useState(null);
  const [originalList, setOriginalList] = useState(null);

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
    return <s.TopMessage>{strings.noRecommendedArticles}</s.TopMessage>;
  }

  return (
    <>
      <br />
      <br />
      <SortingButtons
        articleList={articleList}
        originalList={originalList}
        setArticleList={setArticleList}
      />
      {articleList.map((each) => (
        <ArticlePreview
          key={each.id}
          article={each}
          dontShowSourceIcon={true}
        />
      ))}
    </>
  );
}
