import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

import { APIContext } from "../contexts/APIContext";
import { MetaStrip, MetaItem, MetaTag } from "../components/MetaStrip.sc";
import getDomainName from "../utils/misc/getDomainName";
import extractDomain from "../utils/web/extractDomain";

import * as s from "./SavedArticleRow.sc";

const REMOVE_ANIMATION_MS = 300;

// Row-layout card for the My Articles surface. Built separately from
// ArticlePreview because the scan-list mode is conceptually different:
// thumbnail + title + meta in one tappable row, no summary, no large
// CTA button — the image itself is the open affordance (Open overlay
// labels the thumbnail).
export default function SavedArticleRow({ article, onArticleRemoved }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // The simplified version is what the user wants to read when an
  // original article also has a simplified child they own.
  const inAppArticleId = article.user_simplified_article_id || article.id;
  const articleHref = `/read/article?id=${inAppArticleId}`;
  const isSimplified = !!(article.parent_article_id || article.is_simplified);
  const sourceDomain =
    article.feed_name ||
    (article.parent_url ? getDomainName(article.parent_url) : extractDomain(article.url));
  const savedAgo = article.personal_copy_saved_at
    ? formatDistanceToNow(new Date(article.personal_copy_saved_at), { addSuffix: true }).replace(
        "about ",
        "",
      )
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
      {article.img_url && (
        <s.ThumbnailWrap>
          <s.Thumbnail src={article.img_url} alt="" />
        </s.ThumbnailWrap>
      )}
      <s.Content>
        <s.Title>{article.title}</s.Title>
        <MetaStrip>
          {isSimplified && <MetaTag>Simplified</MetaTag>}
          {savedAgo && <MetaTag>Saved {savedAgo}</MetaTag>}
          {sourceDomain && <MetaItem>{sourceDomain}</MetaItem>}
        </MetaStrip>
      </s.Content>
      <s.RemoveButton onClick={handleRemove} aria-label="Remove from saves">
        ×
      </s.RemoveButton>
    </s.Row>
  );
}
