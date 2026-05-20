import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isMobile } from "../utils/misc/browserDetection";
import * as s from "./ArticlePreview.sc";
import { MetaStrip, MetaItem, MetaLink, MetaTag } from "../components/MetaStrip.sc";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";
import Feature from "../features/Feature";
import extractDomain from "../utils/web/extractDomain";
import ReadingCompletionProgress from "./ReadingCompletionProgress";
import { APIContext } from "../contexts/APIContext";
import { BrowsingSessionContext } from "../contexts/BrowsingSessionContext";
import { TranslatableText } from "../reader/TranslatableText";
import InteractiveText from "../reader/InteractiveText";
import ZeeguuSpeech from "../speech/APIBasedSpeech";
import { formatDistanceToNow } from "date-fns";
import { estimateReadingTime } from "../utils/misc/readableTime";
import ActionButton from "../components/ActionButton";
import getDomainName from "../utils/misc/getDomainName";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function ArticlePreview({
  article,
  dontShowPublishingTime,
  dontShowSummary = false,
  hasExtension,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
  notifyArticleClick,
  onArticleHidden,
  onArticleRemoved,
  onUnhideArticle,
  isHiddenView = false,
  inSavedView = false,
}) {
  const api = useContext(APIContext);
  const getBrowsingSessionId = useContext(BrowsingSessionContext);
  const [isRedirectionModalOpen, setIsRedirectionModaOpen] = useState(false);
  // In a saved view (My Articles, Classroom, etc.) the article is in the
  // list precisely because it's saved — treat it as such even if the
  // article's has_personal_copy flag hasn't propagated correctly.
  const [isArticleSaved, setIsArticleSaved] = useState(article.has_personal_copy || inSavedView);
  const [interactiveSummary, setInteractiveSummary] = useState(null);
  const [interactiveTitle, setInteractiveTitle] = useState(null);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [zeeguuSpeech] = useState(() => new ZeeguuSpeech(api, article.language));
  const [isHidden, setIsHidden] = useState(article.hidden || false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  useEffect(() => {
    if ((article.summary || article.title) && !isTokenizing && !interactiveSummary && !interactiveTitle) {
      setIsTokenizing(true);

      // Check if article already has tokenized data (optimization to avoid N+1 API calls)
      const summaryData =
        article.interactiveSummary && article.interactiveTitle
          ? {
              tokenized_summary: article.interactiveSummary,
              tokenized_title: article.interactiveTitle,
            }
          : null;

      if (summaryData) {
        // Use pre-loaded summary data (already included in article from /user_articles/recommended)
        processSummaryData(summaryData);
      } else {
        // Fall back to fetching summary separately (for backwards compatibility)
        // Nov '25 - should be removed soon
        api.getArticleSummaryInfo(article.id, processSummaryData);
      }

      function processSummaryData(summaryData) {
        // Create interactive summary
        if (summaryData.tokenized_summary) {
          const interactive = new InteractiveText(
            summaryData.tokenized_summary.tokens,
            article.source_id,
            api,
            summaryData.tokenized_summary.past_bookmarks,
            api.TRANSLATE_TEXT,
            article.language,
            "article_preview",
            zeeguuSpeech,
            summaryData.tokenized_summary.context_identifier,
            null, // formatting
            getBrowsingSessionId,
          );
          setInteractiveSummary(interactive);
        }

        // Create interactive title
        if (summaryData.tokenized_title && summaryData.tokenized_title.tokens) {
          const titleInteractive = new InteractiveText(
            summaryData.tokenized_title.tokens,
            article.source_id,
            api,
            summaryData.tokenized_title.past_bookmarks || [],
            api.TRANSLATE_TEXT,
            article.language,
            "article_preview",
            zeeguuSpeech,
            summaryData.tokenized_title.context_identifier,
            null, // formatting
            getBrowsingSessionId,
          );
          setInteractiveTitle(titleInteractive);
        }
        setIsTokenizing(false);
      }
    }
  }, [
    article.summary,
    article.title,
    article.language,
    article.id,
    api,
    zeeguuSpeech,
    // isTokenizing removed - was causing infinite loop!
    // interactiveSummary removed - was causing infinite loop!
    // interactiveTitle removed - was causing infinite loop!
  ]);

  const handleArticleClick = () => {
    if (notifyArticleClick) {
      notifyArticleClick(article.source_id);
    }
  };

  let topics = article.topics_list;

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
      // Delay the actual hiding to allow animation to complete
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

  const is_saved = article.has_personal_copy || article.has_uploader || isArticleSaved === true;
  const externalUrl = article.parent_url || article.url;
  // Either flavor of simplification gives us a Zeeguu-readable body —
  // a simplified article (parent_article_id set) or an original whose
  // simplified child this user already has (user_simplified_article_id).
  // The Link target in either case is the simplified id.
  const hasInAppSimplification = !!(article.parent_article_id || article.user_simplified_article_id);
  const inAppArticleId = article.user_simplified_article_id || article.id;
  const should_open_in_zeeguu = Feature.always_open_externally()
    ? is_saved || hasInAppSimplification
    : article.video ||
      (!Feature.extension_experiment1() && !hasExtension) ||
      is_saved ||
      hasInAppSimplification;
  const should_open_with_modal = doNotShowRedirectionModal_UserPreference === false;

  // The image-as-Open affordance. Returns just the clickable Link /
  // button / anchor with the image + Open overlay inside (no
  // ImageWithOverlay wrapper). Callers wrap this in s.ImageWithOverlay
  // and stack the Save icon as a sibling so the icon click doesn't
  // bubble into this link.
  function imageLink() {
    const innerLinkStyle = { display: "block", position: "relative", lineHeight: 0 };
    const imgInner = (
      <>
        <img alt="" src={article.img_url} style={{ cursor: "pointer", display: "block" }} />
        <s.ImageOpenOverlay>
          Open
          {!should_open_in_zeeguu && (
            <OpenInNewRoundedIcon style={{ fontSize: 14, marginLeft: 4 }} />
          )}
        </s.ImageOpenOverlay>
      </>
    );
    if (should_open_in_zeeguu) {
      return (
        <Link to={`/read/article?id=${inAppArticleId}`} onClick={handleArticleClick} style={innerLinkStyle}>
          {imgInner}
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
          style={{ ...innerLinkStyle, background: "none", border: "none", padding: 0, cursor: "pointer", width: "100%" }}
        >
          {imgInner}
        </button>
      );
    }
    return (
      <a
        target={isMobile ? "_self" : "_blank"}
        rel="noreferrer"
        href={externalUrl}
        onClick={handleArticleClick}
        style={innerLinkStyle}
      >
        {imgInner}
      </a>
    );
  }

  function titleLink(article) {
    let linkToRedirect = `/read/article?id=${inAppArticleId}`;

    let open_in_zeeguu = (
      <ActionButton as={Link} to={linkToRedirect} onClick={handleArticleClick} variant="internal">
        {is_saved ? "Open" : "Read Full"}
      </ActionButton>
    );

    let open_externally_with_modal = (
      //The RedirectionNotificationModal modal informs the user that they are about
      //to be redirected to the original article's website and guides them on what steps
      //should be taken to start reading the said article with The Zeeguu Reader extension
      //The modal is displayed when the user clicks the article's title from the recommendation
      //list and can be deactivated when they select "Do not show again" and proceed.
      <>
        <RedirectionNotificationModal
          hasExtension={hasExtension}
          article={article}
          open={isRedirectionModalOpen}
          handleCloseRedirectionModal={handleCloseRedirectionModal}
          setDoNotShowRedirectionModal_UserPreference={setDoNotShowRedirectionModal_UserPreference}
          setIsArticleSaved={setIsArticleSaved}
        />
        <ActionButton
          onClick={() => {
            handleArticleClick();
            handleOpenRedirectionModal();
          }}
        >
          Open <OpenInNewRoundedIcon style={{ fontSize: 16, marginLeft: 4 }} />
        </ActionButton>
      </>
    );

    let open_externally_without_modal = (
      //allow target _self on mobile to easily go back to Zeeguu
      //using mobile browser navigation
      <ActionButton
        as="a"
        target={isMobile ? "_self" : "_blank"}
        rel="noreferrer"
        href={externalUrl}
        onClick={handleArticleClick}
      >
        Open <OpenInNewRoundedIcon style={{ fontSize: 16, marginLeft: 4 }} />
      </ActionButton>
    );

    if (should_open_in_zeeguu) return open_in_zeeguu;
    else if (should_open_with_modal) return open_externally_with_modal;
    else return open_externally_without_modal;
  }

  if (isHidden && !isHiddenView) {
    return null;
  }

  // Meta strip splits time across two slots so its position matches the
  // sort axis of the surface:
  //   - In Saved-list contexts the time IS the save time and goes up front
  //     with the state tags ("Saved 2h ago · ekkofilm.dk").
  //   - Elsewhere it's publish time and sits at the tail, news-feed style
  //     ("Simplified · Saved · ekkofilm.dk · 2h ago").
  // dontShowPublishingTime only suppresses *publish* time. The "Saved Xh ago"
  // pill is the replacement for it on saved-list surfaces (where the prop is
  // typically true), so the saved-time path isn't gated on the same flag.
  let savedTag = null;
  let publishedTimeSlot = null;
  if (inSavedView && article.personal_copy_saved_at) {
    const savedAgo = formatDistanceToNow(new Date(article.personal_copy_saved_at), { addSuffix: true }).replace("about ", "");
    savedTag = <MetaTag>Saved {savedAgo}</MetaTag>;
  } else if (isArticleSaved && !inSavedView) {
    savedTag = <MetaTag>Saved</MetaTag>;
  }
  if (!inSavedView && !dontShowPublishingTime && article.published) {
    const publishedAgo = formatDistanceToNow(new Date(article.published), { addSuffix: true }).replace("about ", "");
    publishedTimeSlot = <MetaItem>{publishedAgo}</MetaItem>;
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
        {inSavedView && (
          <ReadingCompletionProgress last_reading_percentage={article.reading_completion} />
        )}
      </s.TitleContainer>

      {/* Single quiet metadata strip under the title: CEFR · Simplified ·
          Saved · source · time. State badges (Simplified/Saved) get a subtle
          accent color; source/time stay muted. All on one row, small. */}
      <MetaStrip>
        {article.topics_list && article.topics_list.map(([topicTitle]) => (
          <MetaTag key={topicTitle}>{topicTitle}</MetaTag>
        ))}
        {article.matched_searches && article.matched_searches.map((search) => (
          <MetaItem key={`search-${search}`}>
            🔍&nbsp;
            <MetaLink as={Link} to={`/search?search=${encodeURIComponent(search)}`}>
              {search}
            </MetaLink>
          </MetaItem>
        ))}
        {article.parent_article_id && (
          <MetaTag>Simplified</MetaTag>
        )}
        {savedTag}
        <MetaItem>
          <MetaLink
            href={article.parent_url || article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {article.feed_name || (article.parent_url ? getDomainName(article.parent_url) : extractDomain(article.url))}
          </MetaLink>
        </MetaItem>
        {publishedTimeSlot}
        {(article.metrics?.word_count || article.word_count) > 0 && (
          <MetaItem>
            ~{estimateReadingTime(article.metrics?.word_count || article.word_count || 0)
              .replace(" minutes", "min")
              .replace(" minute", "min")}
          </MetaItem>
        )}
      </MetaStrip>

      <s.ArticleContent>
        {article.img_url && (
          <s.ImageWithOverlay>
            {imageLink()}
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
        {/* Summary block hosts summary text + Discover's action row. On
            saved-list surfaces we hide both — image-click already opens,
            the centered Open button below it carries the primary CTA, and
            "(remove from saves)" lives inline with the Saved tag above. */}
        {!inSavedView && (
          <s.Summary>
            {!dontShowSummary && (
              // Summary clamps to 2 lines when collapsed; "more"/"less"
              // toggles in place. Word-tap translation still works on the
              // visible lines (DOM is intact, only visually clipped), and
              // beginners get the full translatable summary on expand.
              <>
                {isSummaryExpanded ? (
                  interactiveSummary ? (
                    <TranslatableText interactiveText={interactiveSummary} translating={true} pronouncing={true} />
                  ) : (
                    article.summary
                  )
                ) : (
                  <s.ClampedSummary>
                    {interactiveSummary ? (
                      <TranslatableText interactiveText={interactiveSummary} translating={true} pronouncing={true} />
                    ) : (
                      article.summary
                    )}
                  </s.ClampedSummary>
                )}
                <s.SummaryToggle
                  type="button"
                  onClick={() => setIsSummaryExpanded((v) => !v)}
                >
                  {isSummaryExpanded ? "Show less" : "Show more"}
                  <span aria-hidden="true">{isSummaryExpanded ? "▴" : "▾"}</span>
                </s.SummaryToggle>
              </>
            )}
            {/* Save lives as a bookmark icon on the image; Hide lives as
                a × in the card's top-right corner. The only thing that
                still needs a button at the bottom of the card is the
                Unhide affordance on the Hidden-articles surface, and a
                fallback Open for the rare article without an image. */}
            {(isHiddenView || !article.img_url) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                {isHiddenView && (
                  <ActionButton onClick={handleUnhideArticle} variant="muted">
                    Unhide
                  </ActionButton>
                )}
                {!article.img_url && titleLink(article)}
              </div>
            )}
          </s.Summary>
        )}
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
          <button
            type="button"
            onClick={handleRemoveFromSaves}
            style={{
              background: "none",
              border: "none",
              padding: "4px 8px",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.85em",
            }}
          >
            remove from saves
          </button>
        </div>
      )}
    </s.ArticlePreview>
  );
}
