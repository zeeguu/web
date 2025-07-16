import { Link } from "react-router-dom";
import { useContext, useState } from "react";
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
import TruncatedSummary from "../components/TruncatedSummary";

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
      <Link to={linkToRedirect} onClick={handleArticleClick}>
        {article.title}
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
        <s.InvisibleTitleButton
          onClick={() => {
            handleArticleClick();
            handleOpenRedirectionModal();
          }}
        >
          {article.title}
        </s.InvisibleTitleButton>
      </>
    );

    let open_externally_without_modal = (
      //allow target _self on mobile to easily go back to Zeeguu
      //using mobile browser navigation
      <a target={isMobile ? "_self" : "_blank"} rel="noreferrer" href={article.url} onClick={handleArticleClick}>
        {article.title}
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
      <SmallSaveArticleButton article={article} isArticleSaved={isArticleSaved} setIsArticleSaved={setIsArticleSaved} />
      <s.TitleContainer>
        <s.Title className={article.opened ? "opened" : ""}>{titleLink(article)} </s.Title>

        <ReadingCompletionProgress last_reading_percentage={article.reading_completion}></ReadingCompletionProgress>
      </s.TitleContainer>

      {article.feed_id ? (
        <ArticleSourceInfo
          articleInfo={article}
          dontShowPublishingTime={dontShowPublishingTime}
          dontShowSourceIcon={dontShowSourceIcon}
        ></ArticleSourceInfo>
      ) : (
        !dontShowSourceIcon && article.url && (
          <s.UrlSourceContainer>
            <s.UrlSource>{extractDomain(article.url)}</s.UrlSource>
            {article.parent_article_id && (
              <s.SimplifiedLabel>
                simplified from {article.parent_cefr_level || 'unknown'}
              </s.SimplifiedLabel>
            )}
          </s.UrlSourceContainer>
        )
      )}

      <s.ArticleContent>
        {article.img_url && <img alt="" src={article.img_url} />}
        <s.Summary>
          <TruncatedSummary text={article.summary} />
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
        <ArticleStatInfo articleInfo={article}></ArticleStatInfo>
      </s.BottomContainer>
    </s.ArticlePreview>
  );
}
