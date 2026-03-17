import React, { useContext } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { toast } from "react-toastify";

import { APIContext } from "../contexts/APIContext";
import * as s from "./UnfinishedArticleList.sc";
import UnfinishedArticlePreview from "./UnfinishedArticlePreview";

export default function UnfinishedArticlesList({
  unfinishedArticles,
  onArticleHidden,
}) {
  let api = useContext(APIContext);

  if (
    unfinishedArticles === undefined ||
    unfinishedArticles.length === 0
  ) {
    return <></>;
  }

  const article = unfinishedArticles[0];

  const handleHide = () => {
    api.hideArticle(article.id, () => {
      if (onArticleHidden) onArticleHidden(article.id);
      toast("Article hidden from your feed");
    });
  };

  return (
    <s.UnfinishedArticlesBox>
      <s.CloseButton onClick={handleHide} aria-label="Hide article">
        <CloseRoundedIcon fontSize="small" />
      </s.CloseButton>
      <s.UnfishedArticleBoxTitle>
        Continue where you left off
      </s.UnfishedArticleBoxTitle>
      <UnfinishedArticlePreview
        article={article}
        onArticleClick={() => {
          api.logUserActivity(api.CLICKED_RESUME_ARTICLE, article.id, "", "");
        }}
      />
    </s.UnfinishedArticlesBox>
  );
}
