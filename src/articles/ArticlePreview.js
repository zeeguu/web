import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { isMobile } from "../utils/misc/browserDetection";
import * as s from "./ArticlePreview.sc";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";
import Feature from "../features/Feature";
import SmallSaveArticleButton from "./SmallSaveArticleButton";
import { TagsOfInterests } from "./TagsOfInterests.sc";
import ArticleSourceInfo from "../components/ArticleSourceInfo";
import ArticleStatInfo from "../components/ArticleStatInfo";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { toast } from "react-toastify";
import { darkBlue } from "../components/colors";
import ExplainTopicsModal from "../pages/ExplainTopicsModal";
import { TopicOriginType } from "../appConstants";
import extractDomain from "../utils/web/extractDomain";
import ReadingCompletionProgress from "./ReadingCompletionProgress";
import { APIContext } from "../contexts/APIContext";
import { TranslatableText } from "../reader/TranslatableText";
import InteractiveText from "../reader/InteractiveText";
import ZeeguuSpeech from "../speech/APIBasedSpeech";
import moment from "moment";
import { getStaticPath } from "../utils/misc/staticPath";
import { estimateReadingTime } from "../utils/misc/readableTime";

export default function ArticlePreview({
  article,
  dontShowPublishingTime,
  dontShowSourceIcon,
  showArticleCompletion,
  hasExtension,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
  notifyArticleClick,
}) {
  const api = useContext(APIContext);
  // Store which topic was clicked to show in the Modal
  const [infoTopicClick, setInfoTopicClick] = useState("");
  const [showInfoTopics, setShowInfoTopics] = useState(false);
  const [isRedirectionModalOpen, setIsRedirectionModaOpen] = useState(false);
  const [isArticleSaved, setIsArticleSaved] = useState(article.has_personal_copy);
  const [showInferredTopic, setShowInferredTopic] = useState(true);
  const [interactiveSummary, setInteractiveSummary] = useState(null);
  const [interactiveTitle, setInteractiveTitle] = useState(null);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [zeeguuSpeech] = useState(() => new ZeeguuSpeech(api, article.language));

  useEffect(() => {
    if ((article.summary || article.title) && !isTokenizing && !interactiveSummary && !interactiveTitle) {
      setIsTokenizing(true);
      api.getArticleSummaryInfo(article.id, (summaryData) => {
        // Create interactive summary
        if (summaryData.tokenized_summary) {
          const interactive = new InteractiveText(
            summaryData.tokenized_summary.tokens,
            article.id,
            api,
            summaryData.tokenized_summary.past_bookmarks,
            api.TRANSLATE_TEXT,
            article.language,
            "article_preview",
            zeeguuSpeech,
            summaryData.tokenized_summary.context_identifier
          );
          setInteractiveSummary(interactive);
        }
        
        // Create interactive title
        if (summaryData.tokenized_title && summaryData.tokenized_title.tokens) {
          const titleInteractive = new InteractiveText(
            summaryData.tokenized_title.tokens,
            article.id,
            api,
            summaryData.tokenized_title.past_bookmarks || [],
            api.TRANSLATE_TEXT,
            article.language,
            "article_preview",
            zeeguuSpeech,
            summaryData.tokenized_title.context_identifier
          );
          setInteractiveTitle(titleInteractive);
        }
        setIsTokenizing(false);
      });
    }
  }, [article.summary, article.title, article.language, article.id, api, zeeguuSpeech, isTokenizing, interactiveSummary, interactiveTitle]);

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

  function titleLink(article) {
    let linkToRedirect = `/read/article?id=${article.id}`;
    
    let open_in_zeeguu = (
      <Link to={linkToRedirect} onClick={handleArticleClick} style={{ color: 'inherit', textDecoration: 'underline' }}>
        [Open]
      </Link>
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
        <button
          onClick={() => {
            handleArticleClick();
            handleOpenRedirectionModal();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
            fontSize: 'inherit'
          }}
        >
          [Open]
        </button>
      </>
    );

    let open_externally_without_modal = (
      //allow target _self on mobile to easily go back to Zeeguu
      //using mobile browser navigation
      <a target={isMobile ? "_self" : "_blank"} rel="noreferrer" href={article.url} onClick={handleArticleClick} style={{ color: 'inherit', textDecoration: 'underline' }}>
        [Open]
      </a>
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

  return (
    <s.ArticlePreview>
      {showInfoTopics && (
        <TagsOfInterests>
          <ExplainTopicsModal
            infoTopicClick={infoTopicClick}
            showInfoTopics={showInfoTopics}
            setShowInfoTopics={setShowInfoTopics}
          />
        </TagsOfInterests>
      )}
      {article.feed_id ? (
        <ArticleSourceInfo
          articleInfo={article}
          dontShowPublishingTime={dontShowPublishingTime}
          dontShowSourceIcon={dontShowSourceIcon}
        />
      ) : (
        !dontShowSourceIcon && article.url && (
          <s.UrlSourceContainer>
            <s.UrlSource>{extractDomain(article.url)}</s.UrlSource>
            {!dontShowPublishingTime && article.published && (
              <span style={{ marginLeft: '5px' }}>
                ({moment.utc(article.published).fromNow()})
              </span>
            )}
          </s.UrlSourceContainer>
        )
      )}

      <s.TitleContainer>
        <s.Title>
          {interactiveTitle ? (
            <TranslatableText
              interactiveText={interactiveTitle}
              translating={true}
              pronouncing={false}
            />
          ) : (
            article.title
          )}
        </s.Title>
        <ReadingCompletionProgress last_reading_percentage={article.reading_completion}></ReadingCompletionProgress>
      </s.TitleContainer>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Difficulty (CEFR level) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <img
              src={getStaticPath("icons", `${(article.metrics?.cefr_level || article.cefr_level || 'B1')}-level-icon.png`)}
              alt="difficulty icon"
              style={{ width: '16px', height: '16px' }}
            />
            <span>{article.metrics?.cefr_level || article.cefr_level || 'B1'}</span>
          </div>
          
          {/* Simplified label if available - TESTING: all articles shown as simplified */}
          <s.SimplifiedLabel>
            simplified
          </s.SimplifiedLabel>
        </div>
        
        <div>
          {/* Reading time only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <img
              src={getStaticPath("icons", "read-time-icon.png")}
              alt="read time icon"
              style={{ width: '16px', height: '16px' }}
            />
            <span>~ {estimateReadingTime(article.metrics?.word_count || article.word_count || 0)}</span>
          </div>
        </div>
      </div>

      <s.ArticleContent>
        {article.img_url && <img alt="" src={article.img_url} />}
        <s.Summary style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px' }}>
          <span style={{ flex: '1', minWidth: 'fit-content' }}>
            {interactiveSummary ? (
              <TranslatableText
                interactiveText={interactiveSummary}
                translating={true}
                pronouncing={false}
              />
            ) : (
              article.summary
            )}
          </span>
          <div style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {titleLink(article)}
            <SmallSaveArticleButton article={article} isArticleSaved={isArticleSaved} setIsArticleSaved={setIsArticleSaved} />
          </div>
        </s.Summary>
      </s.ArticleContent>

      <s.BottomContainer>
        <div>
          {showInferredTopic && topics.length > 0 && (
            <s.UrlTopics>
              {topics.map(([topicTitle, topicOrigin]) => (
                <span
                  onClick={() => {
                    setShowInfoTopics(!showInfoTopics);
                    setInfoTopicClick(topicTitle);
                  }}
                  key={topicTitle}
                  className={topicOrigin === TopicOriginType.INFERRED ? "inferred" : "gold"}
                >
                  {topicTitle}
                  {topicOrigin === TopicOriginType.INFERRED && (
                    <HighlightOffRoundedIcon
                      className="cancelButton"
                      sx={{ color: darkBlue }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInferredTopic(false);
                        toast("Your preference was saved.");
                        api.removeMLSuggestion(article.id, topicTitle);
                      }}
                    />
                  )}
                </span>
              ))}
            </s.UrlTopics>
          )}
        </div>
      </s.BottomContainer>
    </s.ArticlePreview>
  );
}
