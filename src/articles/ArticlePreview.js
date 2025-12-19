import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isMobile } from "../utils/misc/browserDetection";
import * as s from "./ArticlePreview.sc";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";
import Feature from "../features/Feature";
import SaveArticleButton from "./SaveArticleButton";
import ArticleSourceInfo from "../components/ArticleSourceInfo";
import extractDomain from "../utils/web/extractDomain";
import ReadingCompletionProgress from "./ReadingCompletionProgress";
import { APIContext } from "../contexts/APIContext";
import { BrowsingSessionContext } from "../contexts/BrowsingSessionContext";
import { TranslatableText } from "../reader/TranslatableText";
import InteractiveText from "../reader/InteractiveText";
import ZeeguuSpeech from "../speech/APIBasedSpeech";
import { formatDistanceToNow } from "date-fns";
import { getStaticPath } from "../utils/misc/staticPath";
import { estimateReadingTime } from "../utils/misc/readableTime";
import ActionButton from "../components/ActionButton";
import { getHighestCefrLevel } from "../utils/misc/cefrHelpers";
import getDomainName from "../utils/misc/getDomainName";
import ArticleTopics from "../components/ArticleTopics";

export default function ArticlePreview({
  article,
  dontShowPublishingTime,
  dontShowSourceIcon,
  showArticleCompletion,
  hasExtension,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
  notifyArticleClick,
  onArticleHidden,
}) {
  const api = useContext(APIContext);
  const getBrowsingSessionId = useContext(BrowsingSessionContext);
  const [isRedirectionModalOpen, setIsRedirectionModaOpen] = useState(false);
  const [isArticleSaved, setIsArticleSaved] = useState(article.has_personal_copy);
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

  function titleLink(article) {
    let linkToRedirect = `/read/article?id=${article.id}`;
    let open_in_zeeguu = (
      <ActionButton as={Link} to={linkToRedirect} onClick={handleArticleClick}>
        Read Full
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
          Read Full
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
        href={article.url}
        onClick={handleArticleClick}
      >
        Read Full
      </ActionButton>
    );

    let should_open_in_zeeguu =
      article.video ||
      (!Feature.extension_experiment1() && !hasExtension) ||
      article.has_personal_copy ||
      article.has_uploader ||
      isArticleSaved === true ||
      article.parent_article_id; // Simplified articles (with parent_article_id) always open in Zeeguu reader

    let should_open_with_modal = doNotShowRedirectionModal_UserPreference === false;

    if (should_open_in_zeeguu) return open_in_zeeguu;
    else if (should_open_with_modal) return open_externally_with_modal;
    else return open_externally_without_modal;
  }

  if (isHidden) {
    return null;
  }

  return (
    <s.ArticlePreview
      style={{
        maxHeight: isAnimatingOut ? "0" : "1000px",
        opacity: isAnimatingOut ? "0" : "1",
        overflow: "hidden",
        transition: "max-height 0.3s ease-out, opacity 0.3s ease-out",
        marginBottom: isAnimatingOut ? "0" : undefined,
      }}
    >
      {article.feed_id && !dontShowSourceIcon ? (
        <ArticleSourceInfo
          articleInfo={article}
          dontShowPublishingTime={dontShowPublishingTime}
        />
      ) : (
        !dontShowSourceIcon &&
        article.url && (
          <s.UrlSourceContainer>
            <s.UrlSource>{extractDomain(article.url)}</s.UrlSource>
            {!dontShowPublishingTime && article.published && (
              <span style={{ marginLeft: "5px" }}>
                ({formatDistanceToNow(new Date(article.published), { addSuffix: true })})
              </span>
            )}
          </s.UrlSourceContainer>
        )
      )}

      {/* Show teacher name for classroom articles */}
      {article.uploader_name && (
        <div style={{ marginTop: "8px", marginBottom: "8px", fontSize: "0.9em", color: "#666" }}>
          <span style={{ fontWeight: "500" }}>Shared by:</span>{" "}
          <span style={{ color: "#333" }}>{article.uploader_name}</span>
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "15px",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Difficulty (CEFR level) */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img
              src={getStaticPath(
                "icons",
                `${getHighestCefrLevel(article.metrics?.cefr_level || article.cefr_level || "B1")}-level-icon.png`,
              )}
              alt="difficulty icon"
              style={{ width: "16px", height: "16px" }}
            />
            <span>{article.metrics?.cefr_level || article.cefr_level || "B1"}</span>
          </div>

          {/* Simplified tag */}
          {article.parent_article_id && (
            <s.SimplifiedLabel style={{ marginLeft: '8px' }}>Simplified</s.SimplifiedLabel>
          )}

          {/* Source info */}
          {article.parent_article_id && article.parent_url && (
            <a
              href={article.parent_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#888', fontSize: '0.85em', marginLeft: '8px', textDecoration: 'none' }}
            >
              from: {getDomainName(article.parent_url).replace('.dk', '').replace('.se', '').replace('.nl', '').replace('.de', '').replace('.fr', '').replace('.com', '').replace('.org', '')}
            </a>
          )}
        </div>

        <ArticleTopics
          topics={article.topics_list}
          api={api}
          articleId={article.id}
          showInferredTopic={showInferredTopic}
          setShowInferredTopic={setShowInferredTopic}
        />

        {/* Matched search subscriptions */}
        {article.matched_searches && article.matched_searches.length > 0 && (
          <div style={{ marginTop: "8px" }}>
            {article.matched_searches.map((search, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontSize: "0.75em",
                  color: "#b45309",
                  backgroundColor: "#fef3c7",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  marginRight: "6px",
                  fontWeight: "500",
                }}
              >
                🔍 {search}
              </span>
            ))}
          </div>
        )}
      </div>

      <s.ArticleContent>
        {article.img_url && (
          <Link to={`/read/article?id=${article.id}`} onClick={handleArticleClick}>
            <img alt="" src={article.img_url} style={{ cursor: "pointer" }} />
          </Link>
        )}
        <s.Summary style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px" }}>
          <span style={{ flex: "1", minWidth: "fit-content" }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.85em', marginRight: '5px' }}>Summary</span>
            {interactiveSummary ? (
              <TranslatableText interactiveText={interactiveSummary} translating={true} pronouncing={true} />
            ) : (
              article.summary
            )}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "8px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "0 0 auto" }}>
              {titleLink(article)}
              <span style={{ fontSize: "0.8em", opacity: 0.7 }}>
                (~{estimateReadingTime(article.metrics?.word_count || article.word_count || 0)
                  .replace(" minutes", "min")
                  .replace(" minute", "min")})
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "0 0 auto" }}>
              <SaveArticleButton
                article={article}
                isArticleSaved={isArticleSaved}
                setIsArticleSaved={setIsArticleSaved}
                variant="muted"
              />
              <ActionButton onClick={handleHideArticle} variant="muted">
                Hide
              </ActionButton>
            </div>
          </div>
        </s.Summary>
      </s.ArticleContent>
    </s.ArticlePreview>
  );
}
