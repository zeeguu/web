import React, { useContext } from "react";

import { APIContext } from "../contexts/APIContext";
import * as s from "./UnfinishedArticleList.sc";
import UnfinishedArticlePreview from "./UnfinishedArticlePreview";

export default function UnfinishedArticlesList({
  unfinishedArticles,
}) {
  let api = useContext(APIContext);

  // unfinishedArticles is now passed from parent component
  // No need for separate API call or state management

  if (
    unfinishedArticles === undefined ||
    unfinishedArticles.length === 0
  ) {
    return <></>;
  }

  return (
    <>
      <s.UnfinishedArticlesBox>
        <s.UnfishedArticleBoxTitle>
          Continue where you left off
        </s.UnfishedArticleBoxTitle>
        {unfinishedArticles.map((each, index) => (
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
