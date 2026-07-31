import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { APIContext } from "../contexts/APIContext";
import { SharedArticlesContext } from "../contexts/SharedArticlesContext";
import { MetaStrip, MetaItem, MetaTag } from "../components/MetaStrip.sc";
import { articleSourceLabel } from "../utils/misc/articleHelpers";
import { topicIconFor } from "../utils/misc/topicIcon";

import * as s from "./SavedArticleRow.sc";

// A "Shared with you" row. Reuses the saved-article row styling so shares look
// native to the reading area, but with share-specific meta (who shared it, the
// note) and actions: click opens the ORIGINAL article (the reader adapts it to
// the recipient's language + level), × dismisses it from the inbox.
export default function SharedArticleRow({ share }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const { refreshSharedArticles } = useContext(SharedArticlesContext);

  const article = share.article || {};
  const PlaceholderIcon = topicIconFor(article.topics_list);
  const sourceDomain = articleSourceLabel(article);

  function handleOpen() {
    api.markSharedArticleRead(share.id);
    history.push(`/read/article?id=${article.id}`);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  }

  function handleDismiss(e) {
    e.preventDefault();
    e.stopPropagation();
    api
      .dismissSharedArticle(share.id)
      .then(() => refreshSharedArticles())
      .catch(() => toast.error("Could not dismiss."));
  }

  // The sharer's name links to their profile. stopPropagation so it doesn't
  // also trigger the row's open-article click.
  function handleOpenProfile(e) {
    e.preventDefault();
    e.stopPropagation();
    history.push(`/profile/${encodeURIComponent(share.from_user_username)}`);
  }

  function handleProfileKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") handleOpenProfile(e);
  }

  return (
    <s.Row
      style={{ cursor: "pointer" }}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
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
        <s.Title>{article.title || "Untitled article"}</s.Title>
        <MetaStrip>
          {!share.read && <MetaTag>New</MetaTag>}
          <MetaTag>
            Shared by{" "}
            {share.from_user_username ? (
              <span
                onClick={handleOpenProfile}
                onKeyDown={handleProfileKeyDown}
                role="link"
                tabIndex={0}
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                {share.from_user_name}
              </span>
            ) : (
              share.from_user_name
            )}
          </MetaTag>
          {share.note && <MetaItem style={{ fontStyle: "italic" }}>“{share.note}”</MetaItem>}
          {sourceDomain && <MetaItem>{sourceDomain}</MetaItem>}
        </MetaStrip>
      </s.Content>
      <s.RemoveButton onClick={handleDismiss} aria-label="Dismiss">
        ×
      </s.RemoveButton>
    </s.Row>
  );
}
