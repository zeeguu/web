import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { APIContext } from "../contexts/APIContext";
import { MetaStrip, MetaItem, MetaTag } from "../components/MetaStrip.sc";
import { articleSourceLabel, aiProvenanceLabel } from "../utils/misc/articleHelpers";
import { timeAgo } from "../utils/misc/readableTime";

import ArticleThumbnail from "./ArticleThumbnail";
import ReadingCompletion from "./ReadingCompletion";
import * as s from "./SavedArticleRow.sc";

const REMOVE_ANIMATION_MS = 300;

export default function SavedArticleRow({ article, onArticleRemoved }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const articleHref = `/read/article?id=${article.user_simplified_article_id || article.id}`;
  const aiLabel = aiProvenanceLabel(article);
  const sourceDomain = articleSourceLabel(article);
  const savedAgo = article.personal_copy_saved_at
    ? timeAgo(article.personal_copy_saved_at)
    : null;

  function handleRemove(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimatingOut(true);
    api.removePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setTimeout(() => {
          if (onArticleRemoved) onArticleRemoved(article.id);
        }, REMOVE_ANIMATION_MS);
        toast("Article removed from your Saves!");
      } else {
        setIsAnimatingOut(false);
      }
    });
  }

  const animatingStyle = {
    maxHeight: isAnimatingOut ? "0" : "300px",
    opacity: isAnimatingOut ? "0" : "1",
    overflow: isAnimatingOut ? "hidden" : "visible",
    transition: `max-height ${REMOVE_ANIMATION_MS}ms ease-out, opacity ${REMOVE_ANIMATION_MS}ms ease-out`,
    marginBottom: isAnimatingOut ? "0" : undefined,
  };

  function handleRowOpen() {
    history.push(articleHref);
  }

  function handleRowKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRowOpen();
    }
  }

  return (
    <s.Row
      style={{ ...animatingStyle, cursor: "pointer" }}
      onClick={handleRowOpen}
      onKeyDown={handleRowKeyDown}
      role="button"
      tabIndex={0}
    >
      <ArticleThumbnail article={article} />
      <s.Content>
        <s.Title>{article.title}</s.Title>
        <MetaStrip>
          {aiLabel && <MetaTag>{aiLabel}</MetaTag>}
          {savedAgo && <MetaTag>Saved {savedAgo}</MetaTag>}
          <ReadingCompletion ratio={article.reading_completion} />
          {sourceDomain && <MetaItem>{sourceDomain}</MetaItem>}
        </MetaStrip>
      </s.Content>
      <s.RemoveButton onClick={handleRemove} aria-label="Remove from saves">
        ×
      </s.RemoveButton>
    </s.Row>
  );
}
