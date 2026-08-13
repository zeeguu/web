import { useContext, useRef, useState } from "react";
import * as s from "./ArticlePreviewOverlay.sc";
import Modal from "../components/modal_shared/Modal";
import { MetaStrip, MetaItem, MetaLink, MetaTag } from "../components/MetaStrip.sc";
import ActionButton from "../components/ActionButton";
import ToolbarButtons from "../reader/ToolbarButtons";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";
import { TranslatableText } from "../reader/TranslatableText";
import useUserPreferences from "../hooks/useUserPreferences";
import useArticlePreviewTokens from "../hooks/useArticlePreviewTokens";
import { APIContext } from "../contexts/APIContext";
import { articleSourceLabel } from "../utils/misc/articleHelpers";
import { estimateReadingTime, timeAgo } from "../utils/misc/readableTime";
import { isMobile } from "../utils/misc/browserDetection";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// The interactive Preview overlay opened when a feed card with no in-app copy
// is tapped in Preview/Titles browsing mode (articles we CAN read in-app open
// the full reader directly instead, so this overlay never offers "Read full").
// It carries the interactive title + summary and the actions Open original +
// Save. Tokenization happens lazily — only once the overlay is opened.
export default function ArticlePreviewOverlay({
  article,
  open,
  onClose,
  hasExtension,
  isArticleSaved,
  onToggleSave,
  setIsArticleSaved,
  externalUrl,
  should_open_with_modal,
  setDoNotShowRedirectionModal_UserPreference,
}) {
  const api = useContext(APIContext);
  const [isRedirectionModalOpen, setIsRedirectionModalOpen] = useState(false);
  // Interactive title + summary, tokenized lazily once the overlay opens.
  const { interactiveTitle, interactiveSummary } = useArticlePreviewTokens(article, { enabled: open });

  // Same interactive-text preferences as the reader (translation / pronunciation
  // / MWE hints), shared via the same user-preferences store + settings gear.
  const {
    translateInReader,
    updateTranslateInReader,
    pronounceInReader,
    updatePronounceInReader,
    showMweHints,
    updateShowMweHints,
    showReadingTimer,
    updateShowReadingTimer,
  } = useUserPreferences(api);
  // Text size shares the reader's persisted value (localStorage), 14–28px.
  const [readerFontSize, setReaderFontSizeState] = useState(() => {
    const saved = parseInt(localStorage.getItem("reader_font_size"), 10);
    return Number.isFinite(saved) ? saved : 18;
  });
  function setReaderFontSize(value) {
    const clamped = Math.max(14, Math.min(28, value));
    setReaderFontSizeState(clamped);
    localStorage.setItem("reader_font_size", String(clamped));
  }

  const hasImage = !!article.img_url;

  function handleOpenOriginal() {
    // No-extension users get the usual "you're leaving Zeeguu" prompt (unless
    // they've opted out); everyone else goes straight to the publisher.
    if (should_open_with_modal) {
      setIsRedirectionModalOpen(true);
    } else {
      window.open(externalUrl, isMobile() ? "_self" : "_blank", "noreferrer");
    }
  }

  // Swipe-right-to-dismiss (touch): the sheet follows the finger and flings off
  // to the right past the threshold, else snaps back. Plain React onTouch
  // handlers on the ScrollArea (reliable on iOS), and the transform is applied
  // to the whole sheet via the Modal's wrapperStyle prop (MUI preserves style,
  // but clobbers refs). Only on the mobile bottom sheet, where a plain
  // translateX is correct; desktop keeps its centered layout + Close button.
  const isSheet = typeof window !== "undefined" && window.innerWidth <= 576;
  const touchStart = useRef(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  function handleTouchStart(e) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, horiz: false };
  }
  function handleTouchMove(e) {
    const s = touchStart.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (!s.horiz) {
      if (dx > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        s.horiz = true;
        setDragging(true);
      } else if (Math.abs(dy) > 10) {
        touchStart.current = null; // vertical scroll — let it be
        return;
      }
    }
    if (s.horiz) setDragX(Math.max(0, dx));
  }
  function handleTouchEnd(e) {
    const s = touchStart.current;
    touchStart.current = null;
    setDragging(false);
    if (!s || !s.horiz) {
      setDragX(0);
      return;
    }
    const dx = e.changedTouches[0].clientX - s.x;
    if (dx > 80) {
      setDragX(window.innerWidth); // fling off, then unmount
      setTimeout(onClose, 180);
    } else {
      setDragX(0); // snap back
    }
  }

  const wrapperStyle = isSheet
    ? {
        transform: `translateX(${dragX}px)`,
        transition: dragging ? "none" : "transform 0.2s ease-out, opacity 0.2s ease-out",
        opacity: dragX > 0 ? Math.max(0.2, 1 - dragX / 500) : 1,
      }
    : undefined;

  const publishedAgo = article.published ? timeAgo(article.published) : null;
  const wordCount = article.metrics?.word_count || article.word_count || 0;

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        bottomSheetOnMobile
        flushBottom
        hideCloseButton
        animateIn
        wrapperStyle={wrapperStyle}
      >
        {/* Settings gear (same controls as the reader), pinned top-right,
            outside the scroll area so its popover isn't clipped. */}
        <s.Gear>
          <ToolbarButtons
            translating={translateInReader}
            setTranslating={updateTranslateInReader}
            pronouncing={pronounceInReader}
            setPronouncing={updatePronounceInReader}
            showMweHints={showMweHints}
            setShowMweHints={updateShowMweHints}
            showReadingTimer={showReadingTimer}
            setShowReadingTimer={updateShowReadingTimer}
            readerFontSize={readerFontSize}
            setReaderFontSize={setReaderFontSize}
          />
        </s.Gear>

        <s.ScrollArea
          style={{ fontSize: `${readerFontSize}px` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <s.Title>
            {interactiveTitle ? (
              <TranslatableText
                interactiveText={interactiveTitle}
                translating={translateInReader}
                pronouncing={pronounceInReader}
                showMweHints={showMweHints}
              />
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
          </MetaStrip>

          <s.SaveRow>
            <ActionButton variant="muted" onClick={onToggleSave}>
              {isArticleSaved ? (
                <BookmarkRoundedIcon style={{ fontSize: 18, marginRight: 4 }} />
              ) : (
                <BookmarkBorderRoundedIcon style={{ fontSize: 18, marginRight: 4 }} />
              )}
              {isArticleSaved ? "Saved" : "Save"}
            </ActionButton>
          </s.SaveRow>

          {hasImage && <s.Image alt="" src={article.img_url} loading="lazy" decoding="async" />}

          {article.summary && (
            <>
              <s.SummaryLabel>Summary</s.SummaryLabel>
              <s.Summary>
                {interactiveSummary ? (
                  <TranslatableText
                    interactiveText={interactiveSummary}
                    translating={translateInReader}
                    pronouncing={pronounceInReader}
                    showMweHints={showMweHints}
                  />
                ) : (
                  article.summary
                )}
              </s.Summary>
            </>
          )}
        </s.ScrollArea>

        {/* Fixed footer. Original is the primary action (this overlay only
            shows for articles we can't read in-app); Save + Close are secondary. */}
        <s.Actions>
          <ActionButton variant="default" onClick={handleOpenOriginal}>
            Original
            {wordCount > 0 && (
              <span style={{ opacity: 0.65, marginLeft: 5, fontWeight: 400 }}>
                ({estimateReadingTime(wordCount).replace(" minutes", "min").replace(" minute", "min")})
              </span>
            )}
            <OpenInNewRoundedIcon style={{ fontSize: 18, marginLeft: 5 }} />
          </ActionButton>
          {/* Save moved into the content above; Share deferred (see
              project_friend_share_multiplexer). Footer is Original + Close. */}
          {/* Close pushed to the far right — explicit fallback to swipe-to-close. */}
          <div style={{ marginLeft: "auto" }}>
            <ActionButton variant="link" onClick={onClose}>
              <CloseRoundedIcon style={{ fontSize: 18, marginRight: 4 }} />
              Close
            </ActionButton>
          </div>
        </s.Actions>
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
