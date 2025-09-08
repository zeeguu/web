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
import { TranslatableText } from "../reader/TranslatableText";
import InteractiveText from "../reader/InteractiveText";
import ZeeguuSpeech from "../speech/APIBasedSpeech";
import moment from "moment";
import { getStaticPath } from "../utils/misc/staticPath";
import { estimateReadingTime } from "../utils/misc/readableTime";
import ActionButton from "../components/ActionButton";

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
  const [isRedirectionModalOpen, setIsRedirectionModaOpen] = useState(false);
  const [isArticleSaved, setIsArticleSaved] = useState(article.has_personal_copy);
  const [showInferredTopic, setShowInferredTopic] = useState(true);
  const [interactiveSummary, setInteractiveSummary] = useState(null);
  const [interactiveTitle, setInteractiveTitle] = useState(null);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [zeeguuSpeech] = useState(() => new ZeeguuSpeech(api, article.language));
  const [isHidden, setIsHidden] = useState(article.hidden || false);

  useEffect(() => {
    if ((article.summary || article.title) && !isTokenizing && !interactiveSummary && !interactiveTitle) {
      setIsTokenizing(true);
      api.getArticleSummaryInfo(article.id, (summaryData) => {
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
          );
          setInteractiveTitle(titleInteractive);
        }
        setIsTokenizing(false);
      });
    }
  }, [
    article.summary,
    article.title,
    article.language,
    article.id,
    api,
    zeeguuSpeech,
    isTokenizing,
    interactiveSummary,
    interactiveTitle,
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
    api.hideArticle(article.id, () => {
      setIsHidden(true);
      if (onArticleHidden) {
        onArticleHidden(article.id);
      }
      toast("Article hidden from your feed!");
    });
  }

  function titleLink(article) {
    let linkToRedirect = `/read/article?id=${article.id}`;

    let open_in_zeeguu = (
      <ActionButton as={Link} to={linkToRedirect} onClick={handleArticleClick}>
        Open
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
          Open
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
        Open
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
    <s.ArticlePreview>
      {article.feed_id ? (
        <ArticleSourceInfo
          articleInfo={article}
          dontShowPublishingTime={dontShowPublishingTime}
          dontShowSourceIcon={dontShowSourceIcon}
        />
      ) : (
        !dontShowSourceIcon &&
        article.url && (
          <s.UrlSourceContainer>
            <s.UrlSource>{extractDomain(article.url)}</s.UrlSource>
            {!dontShowPublishingTime && article.published && (
              <span style={{ marginLeft: "5px" }}>({moment.utc(article.published).fromNow()})</span>
            )}
          </s.UrlSourceContainer>
        )
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Difficulty (CEFR level) */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img
              src={getStaticPath(
                "icons",
                `${article.metrics?.cefr_level || article.cefr_level || "B1"}-level-icon.png`,
              )}
              alt="difficulty icon"
              style={{ width: "16px", height: "16px" }}
            />
            <span>{article.metrics?.cefr_level || article.cefr_level || "B1"}</span>
          </div>

          {/* Simplified label if available */}
          {article.parent_article_id && <s.SimplifiedLabel>simplified</s.SimplifiedLabel>}
        </div>

        <div>
          {/* Reading time only */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img
              src={getStaticPath("icons", "read-time-icon.png")}
              alt="read time icon"
              style={{ width: "16px", height: "16px" }}
            />
            <span>~ {estimateReadingTime(article.metrics?.word_count || article.word_count || 0)}</span>
          </div>
        </div>
      </div>

      <s.ArticleContent>
        {article.img_url && <img alt="" src={article.img_url} />}
        <s.Summary style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px" }}>
          <span style={{ flex: "1", minWidth: "fit-content" }}>
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
              <SaveArticleButton
                article={article}
                isArticleSaved={isArticleSaved}
                setIsArticleSaved={setIsArticleSaved}
              />
            </div>
            <div style={{ flex: "0 0 auto" }}>
              <ActionButton
                onClick={handleHideArticle}
                variant="muted"
              >
                Hide
              </ActionButton>
            </div>
          </div>
        </s.Summary>
      </s.ArticleContent>
    </s.ArticlePreview>
  );
}
