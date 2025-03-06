import React, { useState, useEffect, useContext } from "react";

import { APIContext } from "../contexts/APIContext";
import * as s from "./UnfinishedArticleList.sc";
import UnfinishedArticlePreview from "./UnfinishedArticlePreview";

export default function UnfinishedArticlesList({
  articleList,
  setArticleList,
}) {
  let api = useContext(APIContext);

  const [unfineshedArticleList, setUnfineshedArticleList] = useState();

  useEffect(() => {
    api.getUnfinishedUserReadingSessions((articles) => {
      setUnfineshedArticleList(articles);
      let filterUnfinishedArticles = [...articleList];
      for (let i = 0; i < articles.length; i++) {
        filterUnfinishedArticles = filterUnfinishedArticles.filter(
          (article) => article.id !== articles[i].id,
        );
      }
      setArticleList(filterUnfinishedArticles);
    });
    // eslint-disable-next-line
  }, []);

  if (
    unfineshedArticleList === undefined ||
    unfineshedArticleList.length === 0
  ) {
    return <></>;
  }

  return (
    <>
      <s.UnfinishedArticlesBox>
        <s.UnfishedArticleBoxTitle>
          Continue where you left off
        </s.UnfishedArticleBoxTitle>
        {unfineshedArticleList.map((each, index) => (
          <UnfinishedArticlePreview
            key={each.id}
            article={each}
            onArticleClick={() => {
              api.logUserActivity(api.CLICKED_RESUME_ARTICLE, each.id, "", "");
            }}
          />
        ))}
      </s.UnfinishedArticlesBox>
    </>
  );
}
