import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { APIContext } from "../contexts/APIContext";
import { SharedArticlesContext } from "../contexts/SharedArticlesContext";
import { MetaStrip, MetaItem, MetaTag } from "../components/MetaStrip.sc";
import { articleSourceLabel } from "../utils/misc/articleHelpers";
import { topicIconFor } from "../utils/misc/topicIcon";

import * as s from "./SavedArticleRow.sc";
import { Row, Title, UnreadDot } from "./SharedArticleRow.sc";

// A "Shared with you" row. Reuses the saved-article row styling so shares look
// native to the reading area, but with share-specific meta (who shared it, the
// note) and actions: click opens the ORIGINAL article (the reader adapts it to
// the recipient's language + level), × dismisses it from the inbox.
//
// Unread vs read follows the inbox convention: unread = an orange dot (same as
// the tab badge) + a bold title; read rows recede. Opening an item marks it read
// (dot + bold clear, the badge count drops) — merely viewing the list does not.
export default function SharedArticleRow({ share }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const { refreshSharedArticles } = useContext(SharedArticlesContext);

  const article = share.article || {};
  const unread = !share.read;
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
    <Row $read={share.read} onClick={handleOpen} onKeyDown={handleKeyDown} role="button" tabIndex={0}>
      {unread && <UnreadDot aria-label="Unread" />}
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
        <Title $unread={unread}>{article.title || "Untitled article"}</Title>
        <MetaStrip>
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
    </Row>
  );
}
