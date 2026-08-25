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

// Swipe-to-dismiss thresholds. Distance alone feels sticky, so a quick flick
// dismisses even when it has barely travelled; a slow drag has to cross a
// fraction of the sheet. The minimum fling distance keeps a jittery tap from
// registering as a flick. Vertically the bar is lower: the sheet is taller than
// it is wide, and a downward push on a bottom sheet is an unambiguous "away".
const DISMISS_FRACTION = 0.35; // of the viewport width, horizontally
const V_DISMISS_FRACTION = 0.2; // of the viewport height, vertically
const FLING_VELOCITY = 0.5; // px per ms at release
const FLING_MIN_DISTANCE = 40; // px
const AXIS_LOCK = 10; // px of travel before the gesture commits to an axis
// The backdrop is fully gone by this much travel — comfortably less than the
// narrow side of any phone, so a fling (which sets the travel to a whole
// viewport) has already cleared it before the sheet is off-screen.
const BACKDROP_FADE_DISTANCE = 300; // px
// How long the fling animation runs before the overlay unmounts. One number for
// both, so the sheet and the backdrop finish leaving at the moment they are
// removed — a shorter transition would strand a fully lit backdrop on screen
// for the remaining frames, which is the flicker.
const EXIT_MS = 200;

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

  // Swipe-to-dismiss (touch): the sheet follows the finger and flings away past
  // the threshold, else snaps back. Plain React onTouch handlers (reliable on
  // iOS), and the transform is applied to the whole sheet via the Modal's
  // wrapperStyle prop (MUI preserves style, but clobbers refs). Only on the
  // mobile bottom sheet, where a plain translate is correct; desktop keeps its
  // centered layout and dismisses via the X or the backdrop.
  //
  // Three ways in, all landing in the same drag:
  //   - rightwards, from anywhere (the original gesture);
  //   - either vertical direction, from the header band — a bar the finger can
  //     grab without competing with the text it sits above;
  //   - downwards when the summary is already scrolled to the top, upwards when
  //     it is scrolled to the bottom. At those two points the scroll has nowhere
  //     left to go, so the continued push is spare and means "away". A short
  //     summary that does not scroll at all is at both ends at once, and takes
  //     either direction.
  const isSheet = typeof window !== "undefined" && window.innerWidth <= 576;
  const scrollRef = useRef(null);
  const touchStart = useRef(null);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  function handleTouchStart(e, fromBar = false) {
    if (!isSheet) return; // desktop card does not drag — X or backdrop only
    const t = e.touches[0];
    const el = scrollRef.current;
    // Which vertical directions are spare is decided ONCE, at touch-down: the
    // scroll position mid-gesture is the finger's own doing, and re-reading it
    // would let a drag turn into a dismiss the moment it reached an edge.
    const atTop = !el || el.scrollTop <= 0;
    const atBottom = !el || el.scrollHeight - el.scrollTop - el.clientHeight <= 1;
    // lastX/lastY/lastT trail the finger so touchEnd can measure release
    // velocity, not just total travel.
    touchStart.current = {
      x: t.clientX,
      y: t.clientY,
      axis: null,
      allowDown: fromBar || atTop,
      allowUp: fromBar || atBottom,
      lastX: t.clientX,
      lastY: t.clientY,
      lastT: e.timeStamp,
    };
  }

  function handleTouchMove(e) {
    const s = touchStart.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (!s.axis) {
      if (dx > AXIS_LOCK && Math.abs(dx) > Math.abs(dy) * 1.2) {
        s.axis = "h";
      } else if (Math.abs(dy) > AXIS_LOCK && ((dy > 0 && s.allowDown) || (dy < 0 && s.allowUp))) {
        s.axis = "v";
      } else if (Math.abs(dx) > AXIS_LOCK || Math.abs(dy) > AXIS_LOCK) {
        touchStart.current = null; // an ordinary scroll — let it be
        return;
      } else {
        return;
      }
      setDragging(true);
    }
    if (s.axis === "h") {
      setDragX(Math.max(0, dx));
    } else {
      // Clamp to the directions this gesture was allowed to take, so reversing
      // mid-drag pins the sheet at rest instead of pulling it the wrong way.
      setDragY(dy > 0 ? (s.allowDown ? dy : 0) : s.allowUp ? dy : 0);
    }
    s.lastX = t.clientX;
    s.lastY = t.clientY;
    s.lastT = e.timeStamp;
  }

  function handleTouchEnd(e) {
    const s = touchStart.current;
    touchStart.current = null;
    setDragging(false);
    if (!s || !s.axis) {
      setDragX(0);
      setDragY(0);
      return;
    }
    const horizontal = s.axis === "h";
    const end = horizontal ? e.changedTouches[0].clientX : e.changedTouches[0].clientY;
    const delta = end - (horizontal ? s.x : s.y);
    const velocity = (end - (horizontal ? s.lastX : s.lastY)) / Math.max(1, e.timeStamp - s.lastT);
    const setDrag = horizontal ? setDragX : setDragY;
    const span = horizontal ? window.innerWidth : window.innerHeight;
    const fraction = horizontal ? DISMISS_FRACTION : V_DISMISS_FRACTION;
    // Horizontally only rightwards counts; vertically either way does, as long
    // as this gesture was allowed to go there.
    const allowed = horizontal ? delta > 0 : delta > 0 ? s.allowDown : s.allowUp;
    const flicked =
      Math.abs(velocity) > FLING_VELOCITY &&
      Math.abs(delta) > FLING_MIN_DISTANCE &&
      Math.sign(velocity) === Math.sign(delta);
    if (allowed && (flicked || Math.abs(delta) > span * fraction)) {
      setDrag(Math.sign(delta) * span); // fling off, then unmount
      setTimeout(onClose, EXIT_MS);
    } else {
      setDrag(0); // snap back
    }
  }

  const travel = Math.max(dragX, Math.abs(dragY));

  // The backdrop dims and lifts with the drag, so the card and the dark behind
  // it leave as one thing. Without this the sheet flies off, uncovering a
  // still-black screen, which then blinks out on unmount — the card looks like
  // it dismissed twice. It doubles as feedback on a partial drag: the feed
  // brightens behind the card as you pull it, and dims again if you let go.
  const backdropStyle = isSheet
    ? {
        opacity: Math.max(0, 1 - travel / BACKDROP_FADE_DISTANCE),
        transition: dragging ? "none" : `opacity ${EXIT_MS}ms ease-out`,
      }
    : undefined;

  const wrapperStyle = isSheet
    ? {
        transform: `translate(${dragX}px, ${dragY}px)`,
        transition: dragging ? "none" : `transform ${EXIT_MS}ms ease-out, opacity ${EXIT_MS}ms ease-out`,
        opacity: travel > 0 ? Math.max(0.2, 1 - travel / 500) : 1,
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
        backdropStyle={backdropStyle}
      >
        {/* A band of its own above the scroll area, not a control floating over
            it: the summary scrolls in the space BELOW this strip, so no line of
            text ever runs into the X. Dismissal lives at its left, where it is
            conventional and out of the reading path — the forward action
            (Original) is the primary button at the end of the content instead.
            The band doubles as the drag handle: a grab surface with no words in
            it, so pulling the sheet away never competes with tapping a word. */}
        <s.Header
          onTouchStart={(e) => handleTouchStart(e, true)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <s.CloseCorner type="button" aria-label="Close preview" onClick={onClose}>
            <CloseRoundedIcon style={{ fontSize: 22 }} />
          </s.CloseCorner>
          <s.GrabHandle aria-hidden="true" />
        </s.Header>

        <s.ScrollArea
          ref={scrollRef}
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
