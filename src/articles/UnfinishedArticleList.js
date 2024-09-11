import React, { useState, useEffect, useContext } from "react";

import { APIContext } from "../contexts/APIContext";
import * as s from "./UnfinishedArticleList.sc";
import UnfinishedArticlePreview from "./UnfinishedArticlePreview";

export default function UnfinishedArticlesList({}) {
  let api = useContext(APIContext);

  const [unreadArticleList, setUnreadArticleList] = useState();

  useEffect(() => {
    api.getUnfinishedUserReadingSessions((articles) => {
      setUnreadArticleList(articles);
    });
  }, []);

  if (unreadArticleList === undefined || unreadArticleList.length == 0) {
    return <></>;
  }

  return (
    <>
      <s.UnfinishedArticlesBox>
        <s.UnfishedArticleBoxTitle>
          Continue where you left off
        </s.UnfishedArticleBoxTitle>
        {unreadArticleList.map((each, index) => (
          <UnfinishedArticlePreview
            key={each.id}
            article={each}
            api={api}
            onArticleClick={() => {
              api.logUserActivity(api.CLICKED_RESUME_ARTICLE, each.id, "", "");
            }}
          />
        ))}
      </s.UnfinishedArticlesBox>
    </>
  );
}
