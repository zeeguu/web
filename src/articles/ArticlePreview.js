import { Link, useHistory } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import useClampedOverflow from "../hooks/useClampedOverflow";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isMobile } from "../utils/misc/browserDetection";
import * as s from "./ArticlePreview.sc";
import { MetaStrip, MetaItem, MetaLink, MetaTag } from "../components/MetaStrip.sc";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";
import Feature from "../features/Feature";
import strings from "../i18n/definitions";
import { kioskExpandLabel } from "../kiosk/showMoreLabels";
import ReadingCompletionProgress from "./ReadingCompletionProgress";
import ArticlePreviewOverlay from "./ArticlePreviewOverlay";
import { APIContext } from "../contexts/APIContext";
import { TranslatableText } from "../reader/TranslatableText";
import useArticlePreviewTokens from "../hooks/useArticlePreviewTokens";
import { estimateReadingTime, timeAgo } from "../utils/misc/readableTime";
import ActionButton from "../components/ActionButton";
import { articleSourceLabel } from "../utils/misc/articleHelpers";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

export default function ArticlePreview({
  article,
  dontShowPublishingTime,
  dontShowSummary = false,
  hasExtension,
  kioskMode = false,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
  notifyArticleClick,
  onArticleHidden,
  onArticleRemoved,
  onUnhideArticle,
  isHiddenView = false,
  inSavedView = false,
  // Preview browsing mode: when false, the card is a plain (non-interactive)
  // teaser and a tap opens the interactive ArticlePreviewOverlay instead of
  // rendering the interactive title/summary inline. Default true keeps today's
  // inline-interactive card. Only the Discover/search feed passes this false.
  interactive = true,
  // Titles-only variant of preview mode: a compact row (image left, title
  // right, no summary). Implies !interactive; still opens the overlay on tap.
  compact = false,
}) {
  const api = useContext(APIContext);
  const history = useHistory();
  const [isRedirectionModalOpen, setIsRedirectionModaOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  // Teaser-card + tap-to-open behavior applies only to the live feed — never
  // to saved-list, hidden, or kiosk surfaces, which keep their own rendering.
  const previewMode = !interactive && !inSavedView && !isHiddenView && !kioskMode;
  // In a saved view (My Articles, Classroom, etc.) the article is in the
  // list precisely because it's saved — treat it as such even if the
  // article's has_personal_copy flag hasn't propagated correctly.
  const [isArticleSaved, setIsArticleSaved] = useState(article.has_personal_copy || inSavedView);
  // Interactive title/summary — tokenized only for the inline interactive card.
  // Preview/titles cards are plain teasers; their overlay tokenizes on open.
  const { interactiveTitle, interactiveSummary } = useArticlePreviewTokens(article, { enabled: !previewMode });
  const [isHidden, setIsHidden] = useState(article.hidden || false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  // No img_url, or the <img> 404'd / failed to load — either way we render
  // no image region at all rather than an empty box that reads as broken.
  const [imageFailed, setImageFailed] = useState(false);
  // "Show more" is dead weight when the summary fits in the clamp, but the
  // CSS `…` stays unconditional when the box does overflow — so we need to
  // know which case we're in. useClampedOverflow handles measurement +
  // ResizeObserver so the reading stays in sync with async tokenized
  // content swaps and viewport changes.
  const clampedSummaryRef = useRef(null);
  const summaryOverflows = useClampedOverflow(clampedSummaryRef, {
    enabled: !isSummaryExpanded,
    deps: [interactiveSummary, article.summary],
  });

  const handleArticleClick = () => {
    if (notifyArticleClick) {
      notifyArticleClick(article.source_id);
    }
  };

  let topics = article.topics_list;
  const hasImage = !!article.img_url && !imageFailed;

  function handleCloseRedirectionModal() {
    setIsRedirectionModaOpen(false);
  }

  function handleOpenRedirectionModal() {
    setIsRedirectionModaOpen(true);
  }

  function handleToggleSave(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isArticleSaved) {
      api.removePersonalCopy(article.id, (data) => {
        if (data === "OK") {
          setIsArticleSaved(false);
          toast("Article removed from your Saves!");
        }
      });
    } else {
      api.makePersonalCopy(article.id, (data) => {
        if (data === "OK") {
          setIsArticleSaved(true);
          toast("Article added to your Saves!");
        }
      });
    }
  }

  function handleHideArticle() {
    setIsAnimatingOut(true);
    api.hideArticle(article.id, () => {
      setTimeout(() => {
        setIsHidden(true);
        if (onArticleHidden) {
          onArticleHidden(article.id);
        }
      }, 300); // Match animation duration
      toast("Article hidden from your feed!");
    });
  }

  function handleRemoveFromSaves() {
    setIsAnimatingOut(true);
    api.removePersonalCopy(article.id, (data) => {
      if (data === "OK") {
        setTimeout(() => {
          setIsArticleSaved(false);
          if (onArticleRemoved) onArticleRemoved(article.id);
        }, 300);
        toast("Article removed from your Saves!");
      } else {
        setIsAnimatingOut(false);
      }
    });
  }

  function handleUnhideArticle() {
    if (onUnhideArticle) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        onUnhideArticle(article.id);
      }, 300);
    }
  }

  const is_saved = article.has_personal_copy || article.has_uploader || isArticleSaved;
  const externalUrl = article.parent_url || article.url;
  // Either flavor of simplification gives us a Zeeguu-readable body —
  // a simplified article (parent_article_id set) or an original whose
  // simplified child this user already has (user_simplified_article_id).
  // The Link target in either case is the simplified id.
  const hasInAppSimplification = !!(article.parent_article_id || article.user_simplified_article_id);
  const inAppArticleId = article.user_simplified_article_id || article.id;
  const should_open_in_zeeguu = Feature.always_open_externally()
    ? is_saved || hasInAppSimplification
    : article.video || (!Feature.extension_experiment1() && !hasExtension) || is_saved || hasInAppSimplification;
  const should_open_with_modal = doNotShowRedirectionModal_UserPreference === false;

  // Wraps `children` in the right open-in-Zeeguu / modal / external handler
  // for this article. `buttonExtraStyle` covers the few cases (the image
  // block) where the modal <button> needs to fill its parent's width.
  function navWrap(children, style, buttonExtraStyle = {}) {
    if (should_open_in_zeeguu) {
      return (
        <Link to={`/read/article?id=${inAppArticleId}`} onClick={handleArticleClick} style={style}>
          {children}
        </Link>
      );
    }
    if (should_open_with_modal) {
      return (
        <button
          type="button"
          onClick={() => {
            handleArticleClick();
            handleOpenRedirectionModal();
          }}
          // font-size: inherit so the button matches the anchor cascade —
          // otherwise the UA's non-inheriting button font shrinks any em-based
          // child (e.g. the image's width: 16em), making modal-opened cards'
          // thumbnails smaller than saved/open-in-Zeeguu ones.
          style={{ ...style, background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "inherit", ...buttonExtraStyle }}
        >
          {children}
        </button>
      );
    }
    return (
      <a target={isMobile() ? "_self" : "_blank"} rel="noreferrer" href={externalUrl} onClick={handleArticleClick} style={style}>
        {children}
      </a>
    );
  }

  // The clickable media block at the top of the card: the real <img> plus
  // an "Open" overlay. Returned without the s.ImageWithOverlay wrapper so
  // callers can stack the Save icon as a sibling — nesting it inside this
  // Link would let icon clicks bubble into navigation.
  function mediaLink(visual) {
    const inner = (
      <>
        {visual}
        <s.ImageOpenOverlay>
          Open
          {!should_open_in_zeeguu && <OpenInNewRoundedIcon style={{ fontSize: 18, marginLeft: 4 }} />}
        </s.ImageOpenOverlay>
      </>
    );
    return navWrap(inner, { display: "block", position: "relative", lineHeight: 0 }, { width: "100%" });
  }

  // Image-less cards have no Open overlay to tap, so this quiet text link
  // under the summary carries the same navigation instead.
  const openTextLink = navWrap(
    <>
      Open
      {!should_open_in_zeeguu && <OpenInNewRoundedIcon style={{ fontSize: 16, marginLeft: 4 }} />}
    </>,
    {
      display: "inline-flex",
      alignItems: "center",
      color: "var(--text-muted)",
      fontSize: "inherit",
      fontFamily: "inherit",
      fontWeight: 500,
      textDecoration: "none",
    },
  );

  const imageVisual = (
    <img
      alt=""
      src={article.img_url}
      loading="lazy"
      decoding="async"
      onError={() => setImageFailed(true)}
      style={{ cursor: "pointer", display: "block" }}
    />
  );

  if (isHidden && !isHiddenView) {
    return null;
  }

  // Time slot splits across two MetaStrip positions by sort axis: in
  // saved-list contexts "Saved Xh ago" goes up front with the state
  // tags; elsewhere publish time sits at the tail. `dontShowPublishingTime`
  // suppresses publish time only — the saved-time path is the replacement,
  // so it isn't gated on the same flag.
  let savedTag = null;
  let publishedTimeSlot = null;
  if (inSavedView && article.personal_copy_saved_at) {
    const savedAgo = timeAgo(article.personal_copy_saved_at);
    savedTag = <MetaTag>Saved {savedAgo}</MetaTag>;
  } else if (isArticleSaved && !inSavedView) {
    savedTag = <MetaTag>Saved</MetaTag>;
  }
  if (!inSavedView && !dontShowPublishingTime && article.published) {
    const publishedAgo = timeAgo(article.published);
    publishedTimeSlot = <MetaItem>{publishedAgo}</MetaItem>;
  }

  // Kiosk mode: a non-interactive summary card. Plain (non-translatable)
  // title + image + summary, and the ONLY interaction is "Show more" to
  // expand a clamped summary. No opening, saving, hiding, or meta links.
  if (kioskMode) {
    return (
      <s.ArticlePreview>
        <s.TitleContainer>
          <s.Title>{article.title}</s.Title>
        </s.TitleContainer>
        <s.ArticleContent>
          {hasImage && (
            <s.ImageWithOverlay>
              <img
                alt=""
                src={article.img_url}
                loading="lazy"
                decoding="async"
                onError={() => setImageFailed(true)}
                style={{ display: "block" }}
              />
            </s.ImageWithOverlay>
          )}
          {!dontShowSummary && article.summary && (
            <s.Summary>
              {isSummaryExpanded ? (
                article.summary
              ) : (
                <s.ClampedSummary ref={clampedSummaryRef}>{article.summary}</s.ClampedSummary>
              )}
              {(isSummaryExpanded || summaryOverflows) && (
                <s.SummaryToggle type="button" onClick={() => setIsSummaryExpanded((v) => !v)}>
                  {kioskExpandLabel(article.language, isSummaryExpanded)}
                  <span aria-hidden="true">{isSummaryExpanded ? "▴" : "▾"}</span>
                </s.SummaryToggle>
              )}
            </s.Summary>
          )}
        </s.ArticleContent>
      </s.ArticlePreview>
    );
  }

  // Preview browsing mode: a plain teaser (non-interactive title + summary)
  // whose whole body is one tap target that opens the interactive overlay.
  // "Open" affordances are gone (the card *is* the open). Save (convenience)
  // and Hide stay as stopPropagation siblings so they don't open the overlay.
  if (previewMode) {
    const openPreview = () => {
      handleArticleClick();
      // If we have a Zeeguu-readable copy, tapping opens the full article
      // directly — the preview overlay is only for articles we can't read
      // in-app (external-only), so it never needs a "Read full" action.
      if (should_open_in_zeeguu) {
        history.push(`/read/article?id=${inAppArticleId}`);
      } else {
        setPreviewOpen(true);
      }
    };

    // Shared between the Preview (image + summary) and Headlines (compact)
    // layouts so the meta/image markup isn't duplicated across the two.
    const metaStrip = (
      <MetaStrip>
        {article.topics_list &&
          article.topics_list.map(([topicTitle]) => <MetaTag key={topicTitle}>{topicTitle}</MetaTag>)}
        {article.matched_searches &&
          article.matched_searches.map((search) => (
            <MetaItem key={`search-${search}`}>
              🔍&nbsp;
              <MetaLink
                as={Link}
                to={`/search?search=${encodeURIComponent(search)}`}
                onClick={(e) => e.stopPropagation()}
              >
                {search}
              </MetaLink>
            </MetaItem>
          ))}
        {article.parent_article_id && <MetaTag>Simplified</MetaTag>}
        {savedTag}
        <MetaItem>
          <MetaLink
            className="muted"
            href={article.parent_url || article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {articleSourceLabel(article)}
          </MetaLink>
        </MetaItem>
        {publishedTimeSlot}
        {(article.metrics?.word_count || article.word_count) > 0 && (
          <MetaItem>
            ~
            {estimateReadingTime(article.metrics?.word_count || article.word_count || 0)
              .replace(" minutes", "min")
              .replace(" minute", "min")}
          </MetaItem>
        )}
      </MetaStrip>
    );

    const imageEl = hasImage ? (
      <img
        alt=""
        src={article.img_url}
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
        style={{ display: "block" }}
      />
    ) : null;

    // Save + Hide as quiet icon+text controls, used by BOTH feed layouts at the
    // end of the card. One consistent placement reads cleaner than image
    // overlays in one mode and text in the other — and a small Headlines
    // thumbnail can't carry overlay buttons anyway.
    const feedActions = (
      <s.SummaryActionRow>
        <s.SaveActionButton
          type="button"
          onClick={handleToggleSave}
          aria-label={isArticleSaved ? "Remove from saves" : "Save"}
        >
          {isArticleSaved ? (
            <BookmarkRoundedIcon style={{ fontSize: 16 }} />
          ) : (
            <BookmarkBorderRoundedIcon style={{ fontSize: 16 }} />
          )}
          {isArticleSaved ? "Saved" : "Save"}
        </s.SaveActionButton>
        <s.SaveActionButton
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleHideArticle();
          }}
          aria-label="Hide from feed"
        >
          <VisibilityOffRoundedIcon style={{ fontSize: 16 }} />
          Hide
        </s.SaveActionButton>
      </s.SummaryActionRow>
    );

    return (
      <s.ArticlePreview
        style={{
          maxHeight: isAnimatingOut ? "0" : "1000px",
          opacity: isAnimatingOut ? "0" : "1",
          overflow: isAnimatingOut ? "hidden" : "visible",
          transition: "max-height 0.3s ease-out, opacity 0.3s ease-out",
          marginBottom: isAnimatingOut ? "0" : undefined,
        }}
      >
        {/* With an image, Hide lives as an eye-off at the image's bottom-right
            (mirroring Save at top-right) — the top-right × collided with Save on
            stacked mobile layouts. Image-less cards keep the corner ×. */}
        {!hasImage && (
          <s.HideButton onClick={handleHideArticle} aria-label="Hide from feed">
            <CloseRoundedIcon style={{ fontSize: 18 }} />
          </s.HideButton>
        )}

        <s.PreviewCardClickable
          role="button"
          tabIndex={0}
          onClick={openPreview}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPreview();
            }
          }}
        >
          {compact ? (
            // Headlines: title + meta, with the image below (mobile) or as a
            // small thumbnail to the left (desktop, via CompactCard's reflow).
            <s.CompactCard>
              <s.CompactText>
                <s.Title>{article.title}</s.Title>
                {metaStrip}
                {feedActions}
              </s.CompactText>
              {imageEl && <s.CompactMedia>{imageEl}</s.CompactMedia>}
            </s.CompactCard>
          ) : (
            // Preview: title, meta, image + short summary, then the actions.
            <>
              <s.TitleContainer>
                <s.Title>{article.title}</s.Title>
              </s.TitleContainer>
              {metaStrip}
              <s.ArticleContent>
                {imageEl}
                {article.summary && (
                  <s.PreviewSummary>
                    <s.PreviewClampedSummary>{article.summary}</s.PreviewClampedSummary>
                  </s.PreviewSummary>
                )}
              </s.ArticleContent>
              {feedActions}
            </>
          )}
        </s.PreviewCardClickable>

        {/* Mounted only while open: each card renders one of these, so mounting
            eagerly would run the overlay's prefs fetch + tokenization per card. */}
        {previewOpen && (
          <ArticlePreviewOverlay
            article={article}
            open
            onClose={() => setPreviewOpen(false)}
            hasExtension={hasExtension}
            isArticleSaved={isArticleSaved}
            onToggleSave={handleToggleSave}
            setIsArticleSaved={setIsArticleSaved}
            externalUrl={externalUrl}
            should_open_with_modal={should_open_with_modal}
            setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
          />
        )}
      </s.ArticlePreview>
    );
  }

  return (
    <s.ArticlePreview
      style={{
        maxHeight: isAnimatingOut ? "0" : "1000px",
        opacity: isAnimatingOut ? "0" : "1",
        overflow: isAnimatingOut ? "hidden" : "visible",
        transition: "max-height 0.3s ease-out, opacity 0.3s ease-out",
        marginBottom: isAnimatingOut ? "0" : undefined,
      }}
    >
      {/* Card-level Hide × in the top-right corner. Dismissal pattern;
          replaces the Hide button that used to sit at the bottom. Only
          shown where Hide makes sense (Discover-style surfaces, not in
          the Hidden view, not in saved-list views). */}
      {!isHiddenView && !inSavedView && (
        <s.HideButton onClick={handleHideArticle} aria-label="Hide from feed">
          <CloseRoundedIcon style={{ fontSize: 18 }} />
        </s.HideButton>
      )}

      {/* Show teacher name for classroom articles */}
      {article.uploader_name && (
        <div style={{ marginTop: "8px", marginBottom: "8px", fontSize: "0.9em", color: "var(--text-muted)" }}>
          <span style={{ fontWeight: "500" }}>Shared by:</span>{" "}
          <span style={{ color: "var(--text-primary)" }}>{article.uploader_name}</span>
        </div>
      )}

      <s.TitleContainer>
        <s.Title>
          {interactiveTitle ? (
            <TranslatableText interactiveText={interactiveTitle} translating={true} pronouncing={true} />
          ) : (
            article.title
          )}
        </s.Title>
        {/* Reading-progress only matters on partial-read surfaces. Discover
            articles are almost always 0% (you haven't opened them yet), and
            the empty circle just wastes title width. Keep it for saved-list
            surfaces (teacher OwnArticles uses inSavedView). */}
        {inSavedView && <ReadingCompletionProgress last_reading_percentage={article.reading_completion} />}
      </s.TitleContainer>

      {/* Single quiet metadata strip under the title: CEFR · Simplified ·
          Saved · source · time. State badges (Simplified/Saved) get a subtle
          accent color; source/time stay muted. All on one row, small. */}
      <MetaStrip>
        {article.topics_list &&
          article.topics_list.map(([topicTitle]) => <MetaTag key={topicTitle}>{topicTitle}</MetaTag>)}
        {article.matched_searches &&
          article.matched_searches.map((search) => (
            <MetaItem key={`search-${search}`}>
              🔍&nbsp;
              <MetaLink as={Link} to={`/search?search=${encodeURIComponent(search)}`}>
                {search}
              </MetaLink>
            </MetaItem>
          ))}
        {article.parent_article_id && <MetaTag>Simplified</MetaTag>}
        {savedTag}
        <MetaItem>
          <MetaLink
            className="muted"
            href={article.parent_url || article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {articleSourceLabel(article)}
          </MetaLink>
        </MetaItem>
        {publishedTimeSlot}
        {(article.metrics?.word_count || article.word_count) > 0 && (
          <MetaItem>
            ~
            {estimateReadingTime(article.metrics?.word_count || article.word_count || 0)
              .replace(" minutes", "min")
              .replace(" minute", "min")}
          </MetaItem>
        )}
      </MetaStrip>

      <s.ArticleContent>
        {hasImage && (
          <s.ImageWithOverlay>
            {mediaLink(imageVisual)}
            {/* Save toggle overlaid on the image — bookmark icon flips
                between outline and filled. Sibling of the image-link so
                clicks here don't bubble into navigation. */}
            {!isHiddenView && (
              <s.SaveIconButton
                type="button"
                onClick={handleToggleSave}
                aria-label={isArticleSaved ? "Remove from saves" : "Save"}
              >
                {isArticleSaved ? (
                  <BookmarkRoundedIcon style={{ fontSize: 18 }} />
                ) : (
                  <BookmarkBorderRoundedIcon style={{ fontSize: 18 }} />
                )}
              </s.SaveIconButton>
            )}
          </s.ImageWithOverlay>
        )}
        {!inSavedView &&
          (() => {
            const summaryNode = interactiveSummary ? (
              <TranslatableText interactiveText={interactiveSummary} translating={true} pronouncing={true} />
            ) : (
              article.summary
            );
            return (
              <s.Summary>
                {!dontShowSummary && (
                  <>
                    {isSummaryExpanded ? (
                      summaryNode
                    ) : (
                      <s.ClampedSummary ref={clampedSummaryRef}>{summaryNode}</s.ClampedSummary>
                    )}
                    {(isSummaryExpanded || summaryOverflows) && (
                      <s.SummaryToggle type="button" onClick={() => setIsSummaryExpanded((v) => !v)}>
                        {isSummaryExpanded ? strings.showLess : strings.showMore}
                        <span aria-hidden="true">{isSummaryExpanded ? "▴" : "▾"}</span>
                      </s.SummaryToggle>
                    )}
                  </>
                )}
                {/* Image-less cards dropped the photo region, so its Save +
                    Open controls regroup into one action row here. */}
                {!hasImage && (
                  <s.SummaryActionRow>
                    {!isHiddenView && (
                      <s.SaveActionButton
                        type="button"
                        onClick={handleToggleSave}
                        aria-label={isArticleSaved ? "Remove from saves" : "Save"}
                      >
                        {isArticleSaved ? (
                          <BookmarkRoundedIcon style={{ fontSize: 16 }} />
                        ) : (
                          <BookmarkBorderRoundedIcon style={{ fontSize: 16 }} />
                        )}
                        {isArticleSaved ? "Saved" : "Save"}
                      </s.SaveActionButton>
                    )}
                    {openTextLink}
                  </s.SummaryActionRow>
                )}
                {/* Bottom action row only used as a fallback: the Hidden
                  surface needs Unhide. */}
                {isHiddenView && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "8px",
                    }}
                  >
                    <ActionButton onClick={handleUnhideArticle} variant="muted">
                      Unhide
                    </ActionButton>
                  </div>
                )}
              </s.Summary>
            );
          })()}
      </s.ArticleContent>

      {inSavedView && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.3em",
            marginTop: "0.5em",
          }}
        >
          <Link
            to={`/read/article?id=${inAppArticleId}`}
            onClick={handleArticleClick}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: "14em",
              minHeight: "44px",
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: "var(--action-btn-bg)",
              color: "var(--badge-text)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Open
          </Link>
          <ActionButton onClick={handleRemoveFromSaves} variant="link">
            remove from saves
          </ActionButton>
        </div>
      )}

      <RedirectionNotificationModal
        hasExtension={hasExtension}
        article={article}
        open={isRedirectionModalOpen}
        handleCloseRedirectionModal={handleCloseRedirectionModal}
        setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
        setIsArticleSaved={setIsArticleSaved}
      />
    </s.ArticlePreview>
  );
}
