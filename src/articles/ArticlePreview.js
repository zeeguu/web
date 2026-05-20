import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isMobile } from "../utils/misc/browserDetection";
import * as s from "./ArticlePreview.sc";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";
import Feature from "../features/Feature";
import SaveArticleButton from "./SaveArticleButton";
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
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { TopicOriginType } from "../appConstants";

export default function ArticlePreview({
  article,
  dontShowPublishingTime,
  hasExtension,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
  notifyArticleClick,
  onArticleHidden,
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
  const [showInferredTopic, setShowInferredTopic] = useState(true);
  const [interactiveSummary, setInteractiveSummary] = useState(null);
  const [interactiveTitle, setInteractiveTitle] = useState(null);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [zeeguuSpeech] = useState(() => new ZeeguuSpeech(api, article.language));
  const [isHidden, setIsHidden] = useState(article.hidden || false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

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

  function imageLink() {
    const img = <img alt="" src={article.img_url} style={{ cursor: "pointer" }} />;
    if (should_open_in_zeeguu) {
      return (
        <Link to={`/read/article?id=${inAppArticleId}`} onClick={handleArticleClick}>
          {img}
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
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          {img}
        </button>
      );
    }
    return (
      <a
        target={isMobile ? "_self" : "_blank"}
        rel="noreferrer"
        href={externalUrl}
        onClick={handleArticleClick}
      >
        {img}
      </a>
    );
  }

  function titleLink(article) {
    let linkToRedirect = `/read/article?id=${inAppArticleId}`;

    let open_in_zeeguu = (
      <ActionButton as={Link} to={linkToRedirect} onClick={handleArticleClick}>
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
    savedTag = <s.MetaTag>Saved {savedAgo}</s.MetaTag>;
  } else if (isArticleSaved && !inSavedView) {
    savedTag = <s.MetaTag>Saved</s.MetaTag>;
  }
  if (!inSavedView && !dontShowPublishingTime && article.published) {
    const publishedAgo = formatDistanceToNow(new Date(article.published), { addSuffix: true }).replace("about ", "");
    publishedTimeSlot = <s.MetaItem>{publishedAgo}</s.MetaItem>;
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
      {/* Topics and search tags */}
      <s.UrlTopics style={{ display: 'flex', flexWrap: 'wrap', marginTop: 0, marginBottom: '4px' }}>
        {showInferredTopic && article.topics_list && article.topics_list.map(([topicTitle, topicOrigin]) => (
          <span
            key={topicTitle}
            className={topicOrigin === TopicOriginType.INFERRED ? "inferred" : "gold"}
          >
            {topicTitle}
            {topicOrigin === TopicOriginType.INFERRED && (
              <HighlightOffRoundedIcon
                className="cancelButton"
                sx={{ color: 'var(--text-faint)', fontSize: '1rem', strokeWidth: 0.5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInferredTopic(false);
                  toast("Thanks for your feedback.");
                  api.removeMLSuggestion(article.id, topicTitle);
                }}
              />
            )}
          </span>
        ))}
        {article.matched_searches && article.matched_searches.length > 0 && (
          article.matched_searches.map((search, i) => (
            <span
              key={`search-${i}`}
              style={{
                backgroundColor: "var(--search-tag-bg)",
                border: "solid 1px var(--search-tag-border)",
                color: "var(--search-tag-text)",
              }}
            >
              🔍 <Link to={`/search?search=${encodeURIComponent(search)}`} style={{ color: "inherit", textDecoration: "none" }}>{search}</Link>
            </span>
          ))
        )}
      </s.UrlTopics>

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
        <ReadingCompletionProgress last_reading_percentage={article.reading_completion}></ReadingCompletionProgress>
      </s.TitleContainer>

      {/* Single quiet metadata strip under the title: CEFR · Simplified ·
          Saved · source · time. State badges (Simplified/Saved) get a subtle
          accent color; source/time stay muted. All on one row, small. */}
      <s.MetaStrip>
        {article.parent_article_id && (
          <s.MetaTag>Simplified</s.MetaTag>
        )}
        {savedTag}
        <s.MetaItem>
          <s.MetaLink
            href={article.parent_url || article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {article.feed_name || (article.parent_url ? getDomainName(article.parent_url) : extractDomain(article.url))}
          </s.MetaLink>
        </s.MetaItem>
        {publishedTimeSlot}
      </s.MetaStrip>

      <s.ArticleContent>
        {article.img_url && imageLink()}
        <s.Summary>
          {interactiveSummary ? (
            <TranslatableText interactiveText={interactiveSummary} translating={true} pronouncing={true} />
          ) : (
            article.summary
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {titleLink(article)}
              <span style={{ fontSize: "0.8em", opacity: 0.7 }}>
                (~{estimateReadingTime(article.metrics?.word_count || article.word_count || 0)
                  .replace(" minutes", "min")
                  .replace(" minute", "min")})
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {!isHiddenView && (
                <SaveArticleButton
                  article={article}
                  isArticleSaved={isArticleSaved}
                  setIsArticleSaved={setIsArticleSaved}
                  variant="muted"
                />
              )}
              {isHiddenView ? (
                <ActionButton onClick={handleUnhideArticle} variant="muted">
                  Unhide
                </ActionButton>
              ) : (
                !inSavedView && (
                  <ActionButton onClick={handleHideArticle} variant="muted">
                    Hide
                  </ActionButton>
                )
              )}
            </div>
          </div>
        </s.Summary>
      </s.ArticleContent>
    </s.ArticlePreview>
  );
}
