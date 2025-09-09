import React, { useContext, useEffect, useState } from "react";
import * as s from "./ArticleSwipeBrowser.sc";
import { APIContext } from "../contexts/APIContext";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import LoadingAnimation from "../components/LoadingAnimation";
import ArticlePreview from "./ArticlePreview";
import ArticleSwipeControl from "../components/article_swipe/ArticleSwipeControl";

export default function ArticleSwipeBrowser() {
  const api = useContext(APIContext);

  const [articles, setArticles] = useState(null);
  const [originalList, setOriginalList] = useState(null);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [shouldLoadNewArticles, setShouldLoadNewArticles] = useState(false);

  useEffect(() => {
    setTitle(strings.titleHome);
    api.getUserArticles((fetchedArticles) => {
      setArticles(fetchedArticles);
      setOriginalList([...fetchedArticles]);
      setShouldLoadNewArticles(false);
    });
  }, [api, shouldLoadNewArticles]);

  useEffect(() => {
    if (articles && currentArticleIndex >= articles.length - 1) {
      setShouldLoadNewArticles(true);
    }
  }, [currentArticleIndex, articles]);

  if (articles == null) {
    return <LoadingAnimation />;
  }

  if (currentArticleIndex >= articles.length) {
    return <p>No more articles</p>;
  }

  const handleNextArticle = () => {
    setCurrentArticleIndex((prev) => prev + 1);
  };

  const handleArticleClick = (articleId, sourceId) => {
    const seenList = articles.slice(0, currentArticleIndex).map((each) => each.source_id);
    const seenListAsString = JSON.stringify(seenList, null, 0);
    api.logUserActivity(api.CLICKED_ARTICLE, articleId, "", seenListAsString, sourceId);
  };

  const currentArticle = articles[currentArticleIndex];

  return (
    <s.Container>
      <ArticlePreview
        article={currentArticle}
        isListview={false}
        notifyArticleClick={() => handleArticleClick(currentArticle.id, currentArticle.source_id, currentArticleIndex)}
      />

      <ArticleSwipeControl />
    </s.Container>
  );
}
