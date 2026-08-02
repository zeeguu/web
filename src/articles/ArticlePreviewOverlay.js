import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as s from "./ArticlePreviewOverlay.sc";
import Modal from "../components/modal_shared/Modal";
import { MetaStrip, MetaItem, MetaLink, MetaTag } from "../components/MetaStrip.sc";
import ActionButton from "../components/ActionButton";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";
import { TranslatableText } from "../reader/TranslatableText";
import InteractiveText from "../reader/InteractiveText";
import ZeeguuSpeech from "../speech/APIBasedSpeech";
import { APIContext } from "../contexts/APIContext";
import { BrowsingSessionContext } from "../contexts/BrowsingSessionContext";
import { articleSourceLabel } from "../utils/misc/articleHelpers";
import { estimateReadingTime, timeAgo } from "../utils/misc/readableTime";
import { isMobile } from "../utils/misc/browserDetection";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";

// The interactive Preview overlay opened when a (non-interactive) feed card is
// tapped in Preview browsing mode. It carries the interactive title + summary
// and the article actions (Read full / Open original / Save). Tokenization
// happens lazily here — only once the overlay is actually opened — which is the
// whole point of the mode: the feed no longer tokenizes every summary on mount.
export default function ArticlePreviewOverlay({
  article,
  open,
  onClose,
  hasExtension,
  isArticleSaved,
  onToggleSave,
  setIsArticleSaved,
  should_open_in_zeeguu,
  inAppArticleId,
  externalUrl,
  should_open_with_modal,
  onOpenNavigation,
  setDoNotShowRedirectionModal_UserPreference,
}) {
  const api = useContext(APIContext);
  const getBrowsingSessionId = useContext(BrowsingSessionContext);
  const [interactiveSummary, setInteractiveSummary] = useState(null);
  const [interactiveTitle, setInteractiveTitle] = useState(null);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [zeeguuSpeech] = useState(() => new ZeeguuSpeech(api, article.language));
  const [isRedirectionModalOpen, setIsRedirectionModalOpen] = useState(false);

  // Build the interactive title/summary the first time the overlay opens.
  // Mirrors the data path the old inline card used: prefer the tokenized
  // payload already bundled with the recommended article, else fetch it.
  useEffect(() => {
    if (!open || isTokenizing || interactiveSummary || interactiveTitle) return;
    if (!article.summary && !article.title) return;
    setIsTokenizing(true);

    const preloaded =
      article.interactiveSummary && article.interactiveTitle
        ? { tokenized_summary: article.interactiveSummary, tokenized_title: article.interactiveTitle }
        : null;

    if (preloaded) {
      processSummaryData(preloaded);
    } else {
      api.getArticleSummaryInfo(article.id, processSummaryData);
    }

    function processSummaryData(summaryData) {
      if (summaryData.tokenized_summary) {
        setInteractiveSummary(
          new InteractiveText({
            tokenizedParagraphs: summaryData.tokenized_summary.tokens,
            sourceId: article.source_id,
            api,
            previousBookmarks: summaryData.tokenized_summary.past_bookmarks,
            language: article.language,
            source: "article_preview",
            zeeguuSpeech,
            contextIdentifier: summaryData.tokenized_summary.context_identifier,
            getBrowsingSessionId,
          }),
        );
      }
      if (summaryData.tokenized_title && summaryData.tokenized_title.tokens) {
        setInteractiveTitle(
          new InteractiveText({
            tokenizedParagraphs: summaryData.tokenized_title.tokens,
            sourceId: article.source_id,
            api,
            previousBookmarks: summaryData.tokenized_title.past_bookmarks || [],
            language: article.language,
            source: "article_preview",
            zeeguuSpeech,
            contextIdentifier: summaryData.tokenized_title.context_identifier,
            getBrowsingSessionId,
          }),
        );
      }
      setIsTokenizing(false);
    }
    // eslint-disable-next-line
  }, [open]);

  const hasImage = !!article.img_url;
  // "Read full" == we can open this article in the Zeeguu interactive reader.
  // Reuse the same decision the card computed for its single-click behavior.
  const canReadFull = should_open_in_zeeguu;

  function handleOpenOriginal() {
    if (onOpenNavigation) onOpenNavigation();
    // No-extension users get the usual "you're leaving Zeeguu" prompt (unless
    // they've opted out); everyone else goes straight to the publisher.
    if (should_open_with_modal) {
      setIsRedirectionModalOpen(true);
    } else {
      window.open(externalUrl, isMobile ? "_self" : "_blank", "noreferrer");
    }
  }

  const publishedAgo = article.published ? timeAgo(article.published) : null;
  const wordCount = article.metrics?.word_count || article.word_count || 0;

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <s.Container>
          <s.Title>
            {interactiveTitle ? (
              <TranslatableText interactiveText={interactiveTitle} translating={true} pronouncing={true} />
            ) : (
              article.title
            )}
          </s.Title>

          <MetaStrip>
            {article.topics_list &&
              article.topics_list.map(([topicTitle]) => <MetaTag key={topicTitle}>{topicTitle}</MetaTag>)}
            {article.parent_article_id && <MetaTag>Simplified</MetaTag>}
            {isArticleSaved && <MetaTag>Saved</MetaTag>}
            <MetaItem>
              <MetaLink className="muted" href={externalUrl} target="_blank" rel="noopener noreferrer">
                {articleSourceLabel(article)}
              </MetaLink>
            </MetaItem>
            {publishedAgo && <MetaItem>{publishedAgo}</MetaItem>}
            {wordCount > 0 && (
              <MetaItem>
                ~{estimateReadingTime(wordCount).replace(" minutes", "min").replace(" minute", "min")}
              </MetaItem>
            )}
          </MetaStrip>

          {hasImage && <s.Image alt="" src={article.img_url} loading="lazy" decoding="async" />}

          {article.summary && (
            <s.Summary>
              {interactiveSummary ? (
                <TranslatableText interactiveText={interactiveSummary} translating={true} pronouncing={true} />
              ) : (
                article.summary
              )}
            </s.Summary>
          )}

          <s.Actions>
            {canReadFull && (
              <ActionButton as={Link} to={`/read/article?id=${inAppArticleId}`} variant="internal" onClick={onOpenNavigation}>
                <MenuBookRoundedIcon style={{ fontSize: 18, marginRight: 4 }} />
                Read full
              </ActionButton>
            )}
            <ActionButton variant="muted" onClick={handleOpenOriginal}>
              Open original
              <OpenInNewRoundedIcon style={{ fontSize: 18, marginLeft: 4 }} />
            </ActionButton>
            <ActionButton variant={isArticleSaved ? "muted" : "default"} onClick={onToggleSave}>
              {isArticleSaved ? (
                <BookmarkRoundedIcon style={{ fontSize: 18, marginRight: 4 }} />
              ) : (
                <BookmarkBorderRoundedIcon style={{ fontSize: 18, marginRight: 4 }} />
              )}
              {isArticleSaved ? "Saved" : "Save"}
            </ActionButton>
            {/* Share: intentionally deferred — see project_friend_share_multiplexer. */}
          </s.Actions>
        </s.Container>
      </Modal>

      <RedirectionNotificationModal
        hasExtension={hasExtension}
        article={article}
        open={isRedirectionModalOpen}
        handleCloseRedirectionModal={() => setIsRedirectionModalOpen(false)}
        setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
        setIsArticleSaved={setIsArticleSaved}
      />
    </>
  );
}
