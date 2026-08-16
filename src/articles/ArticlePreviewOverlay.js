import { useContext, useRef, useState } from "react";
import * as s from "./ArticlePreviewOverlay.sc";
import Modal from "../components/modal_shared/Modal";
import { MetaStrip, MetaItem, MetaLink, MetaTag } from "../components/MetaStrip.sc";
import ActionButton from "../components/ActionButton";
import Button from "../pages/_pages_shared/Button.sc";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";
import { TranslatableText } from "../reader/TranslatableText";
import useUserPreferences from "../hooks/useUserPreferences";
import useReaderFontSize from "../hooks/useReaderFontSize";
import { APIContext } from "../contexts/APIContext";
import { articleSourceLabel } from "../utils/misc/articleHelpers";
import { estimateReadingTime, timeAgo } from "../utils/misc/readableTime";
import { isMobile } from "../utils/misc/browserDetection";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// Swipe-right-to-dismiss thresholds. Distance alone feels sticky, so a quick
// flick dismisses even when it has barely travelled; a slow drag has to cross a
// third of the sheet. The minimum fling distance keeps a jittery tap from
// registering as a flick.
const DISMISS_FRACTION = 0.35;
const FLING_VELOCITY = 0.5; // px per ms at release
const FLING_MIN_DISTANCE = 40; // px

// The interactive Preview overlay opened when a feed card with no in-app copy
// is tapped in Preview/Titles browsing mode (articles we CAN read in-app open
// the full reader directly instead, so this overlay never offers "Read full").
// It carries the interactive title + summary and the actions Open original +
// Save. The interactive text is built by the card (lazily, on first open) and
// passed in: it holds the translations tapped out on it, and this overlay
// unmounts on close — owning it here would lose them on every reopen.
export default function ArticlePreviewOverlay({
  article,
  open,
  interactiveTitle,
  interactiveSummary,
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

  // Same interactive-text preferences as the reader — read only here. They are
  // configured in Settings → Reading → Text & highlighting (and in the reader's
  // own gear, where the toggles act on a full page of text). This overlay shows
  // three lines of summary, which is too little to judge a highlighting setting
  // against, and the popover would cover the card it floats over.
  const { translateInReader, pronounceInReader, showMweHints } = useUserPreferences(api);
  const [readerFontSize] = useReaderFontSize();

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
    // lastX/lastT trail the finger so touchEnd can measure release velocity,
    // not just total travel.
    touchStart.current = { x: t.clientX, y: t.clientY, horiz: false, lastX: t.clientX, lastT: e.timeStamp };
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
    if (s.horiz) {
      setDragX(Math.max(0, dx));
      s.lastX = t.clientX;
      s.lastT = e.timeStamp;
    }
  }
  function handleTouchEnd(e) {
    const s = touchStart.current;
    touchStart.current = null;
    setDragging(false);
    if (!s || !s.horiz) {
      setDragX(0);
      return;
    }
    const endX = e.changedTouches[0].clientX;
    const dx = endX - s.x;
    const velocity = (endX - s.lastX) / Math.max(1, e.timeStamp - s.lastT);
    const flicked = velocity > FLING_VELOCITY && dx > FLING_MIN_DISTANCE;
    const dragged = dx > window.innerWidth * DISMISS_FRACTION;
    if (flicked || dragged) {
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
    : // Desktop: width scales with the reader font (60em relative to the chosen
      // text size), so bumping the font keeps a comfortable reading line length
      // instead of squeezing chars into a fixed-px box. Capped at the viewport.
      { width: `min(${60 * readerFontSize}px, 92vw)`, maxWidth: "none" };

  const publishedAgo = article.published ? timeAgo(article.published) : null;
  const wordCount = article.metrics?.word_count || article.word_count || 0;
  const readingTime =
    wordCount > 0 ? estimateReadingTime(wordCount).replace(" minutes", " min").replace(" minute", " min") : null;

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        bottomSheetOnMobile
        hideCloseButton
        animateIn
        darkerBackdrop
        wrapperStyle={wrapperStyle}
      >
        {/* Dismissal lives in the top-left corner, where it is conventional and
            out of the reading path — the forward action (Original) is the
            primary button at the end of the content instead. Outside the scroll
            area so it stays put while the summary scrolls. */}
        <s.CloseCorner type="button" aria-label="Close preview" onClick={onClose}>
          <CloseRoundedIcon style={{ fontSize: 22 }} />
        </s.CloseCorner>

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

          {/* The primary action sits at the END of the content, not in a fixed
              bar: "is this worth my minute?" is the question the summary
              answers, so the button belongs where the reader arrives at the
              answer. A persistent footer would also show the CTA before there
              was anything to judge it on, and cost a band of height throughout. */}
          <s.PrimaryAction>
            <Button className="full-width-btn" onClick={handleOpenOriginal}>
              Read the original
              {readingTime && <s.ActionHint>· {readingTime}</s.ActionHint>}
              <OpenInNewRoundedIcon style={{ fontSize: 20, marginLeft: 2 }} />
            </Button>
          </s.PrimaryAction>
        </s.ScrollArea>
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
