import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { APIContext } from "../contexts/APIContext";
import { MetaStrip, MetaItem, MetaTag } from "../components/MetaStrip.sc";
import { isSimplifiedArticle, articleSourceLabel } from "../utils/misc/articleHelpers";
import { timeAgo } from "../utils/misc/readableTime";
import { topicIconFor } from "../utils/misc/topicIcon";

import * as s from "./SavedArticleRow.sc";

const REMOVE_ANIMATION_MS = 300;

export default function SavedArticleRow({ article, onArticleRemoved }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const articleHref = `/read/article?id=${article.user_simplified_article_id || article.id}`;
  const isSimplified = isSimplifiedArticle(article);
  const sourceDomain = articleSourceLabel(article);
  const savedAgo = article.personal_copy_saved_at
    ? timeAgo(article.personal_copy_saved_at)
    : null;

  const PlaceholderIcon = topicIconFor(article.topics_list);

  // reading_completion is a 0..1 ratio from the backend. Hide the
  // indicator at 0 (default state for a fresh save).
  const completionPercent = Math.round((article.reading_completion || 0) * 100);
  let completionItem = null;
  if (completionPercent >= 100) {
    completionItem = (
      <s.CompletionDone>
        <CheckCircleRoundedIcon style={{ fontSize: 14 }} /> Read
      </s.CompletionDone>
    );
  } else if (completionPercent > 0) {
    completionItem = <s.CompletionInProgress>{completionPercent}% read</s.CompletionInProgress>;
  }

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
      <s.ThumbnailWrap>
        {article.img_url ? (
          <s.Thumbnail src={article.img_url} alt="" loading="lazy" decoding="async" />
        ) : (
          <s.Placeholder>
            <PlaceholderIcon style={{ fontSize: 32 }} />
          </s.Placeholder>
        )}
      </s.ThumbnailWrap>
      <s.Content>
        <s.Title>{article.title}</s.Title>
        <MetaStrip>
          {isSimplified && <MetaTag>Simplified</MetaTag>}
          {savedAgo && <MetaTag>Saved {savedAgo}</MetaTag>}
          {completionItem}
          {sourceDomain && <MetaItem>{sourceDomain}</MetaItem>}
        </MetaStrip>
      </s.Content>
      <s.RemoveButton onClick={handleRemove} aria-label="Remove from saves">
        ×
      </s.RemoveButton>
    </s.Row>
  );
}
