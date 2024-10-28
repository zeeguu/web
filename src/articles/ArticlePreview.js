import { Link } from "react-router-dom";
import { useState } from "react";
import { isMobile } from "../utils/misc/browserDetection";
import * as s from "./ArticlePreview.sc";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";
import Feature from "../features/Feature";
import { extractVideoIDFromURL } from "../utils/misc/youtube";
import SmallSaveArticleButton from "./SmallSaveArticleButton";
import * as sweetM from "./TagsOfInterests.sc";
import ArticleSourceInfo from "../components/ArticleSourceInfo";
import ArticleStatInfo from "../components/ArticleStatInfo";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { toast } from "react-toastify";
import { darkBlue } from "../components/colors";
import ExplainTopicsModal from "../pages/ExplainTopicsModal";
import { TopicOriginType } from "../appConstants";

export default function ArticlePreview({
  article,
  dontShowPublishingTime,
  dontShowSourceIcon,
  hasExtension,
  api,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
  onArticleClick,
}) {
  // Store which topic was clicked to show in the Modal
  const [infoTopicClick, setInfoTopicClick] = useState("");
  const [showInfoTopics, setShowInfoTopics] = useState(false);
  const [isRedirectionModalOpen, setIsRedirectionModaOpen] = useState(false);
  const [isArticleSaved, setIsArticleSaved] = useState(
    article.has_personal_copy,
  );
  const [showInferredTopic, setShowInferredTopic] = useState(true);

  const handleArticleClick = () => {
    if (onArticleClick) {
      onArticleClick(article.id);
    }
  };

  let topics = article.topics.split(" ").filter((each) => each !== "");
  let new_topics = article.new_topics_list;
  let cefr_level = article.metrics.cefr_level;

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
          api={api}
          hasExtension={hasExtension}
          article={article}
          open={isRedirectionModalOpen}
          handleCloseRedirectionModal={handleCloseRedirectionModal}
          setDoNotShowRedirectionModal_UserPreference={
            setDoNotShowRedirectionModal_UserPreference
          }
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
      <a
        target={isMobile ? "_self" : "_blank"}
        rel="noreferrer"
        href={article.url}
        onClick={handleArticleClick}
      >
        {article.title}
      </a>
    );

    let should_open_in_zeeguu =
      article.video ||
      (!Feature.extension_experiment1() && !hasExtension) ||
      article.has_personal_copy ||
      article.has_uploader ||
      isArticleSaved === true;

    let should_open_with_modal =
      doNotShowRedirectionModal_UserPreference === false;

    if (should_open_in_zeeguu) return open_in_zeeguu;
    else if (should_open_with_modal) return open_externally_with_modal;
    else return open_externally_without_modal;
  }

  return (
    <s.ArticlePreview>
      {showInfoTopics && Feature.new_topics() && (
        <sweetM.TagsOfInterests>
          <ExplainTopicsModal
            infoTopicClick={infoTopicClick}
            showInfoTopics={showInfoTopics}
            setShowInfoTopics={setShowInfoTopics}
          />
        </sweetM.TagsOfInterests>
      )}

      <SmallSaveArticleButton
        api={api}
        article={article}
        isArticleSaved={isArticleSaved}
        setIsArticleSaved={setIsArticleSaved}
      />

      <s.Title>{titleLink(article)}</s.Title>
      <ArticleSourceInfo
        articleInfo={article}
        dontShowPublishingTime={dontShowPublishingTime}
        dontShowSourceIcon={dontShowSourceIcon}
      ></ArticleSourceInfo>
      <s.ArticleContent>
        {article.img_url && <img alt="" src={article.img_url} />}
        <s.Summary>{article.summary}...</s.Summary>
      </s.ArticleContent>

      <s.BottomContainer>
        <div>
          {Feature.new_topics() && showInferredTopic && (
            <s.UrlTopics>
              {new_topics.map((tuple) => (
                // Tuple (Topic Title, TopicOriginType)
                <span
                  onClick={() => {
                    setShowInfoTopics(!showInfoTopics);
                    setInfoTopicClick(tuple[0]);
                  }}
                  key={tuple[0]}
                  className={
                    tuple[1] === TopicOriginType.INFERRED ? "inferred" : "gold"
                  }
                >
                  {tuple[0]}
                  {tuple[1] === TopicOriginType.INFERRED && (
                    <HighlightOffRoundedIcon
                      className="cancelButton"
                      sx={{ color: darkBlue }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInferredTopic(false);
                        toast("Your preference was saved.");
                        api.removeMLSuggestion(article.id, tuple[0]);
                      }}
                    />
                  )}
                </span>
              ))}
            </s.UrlTopics>
          )}
          {!Feature.new_topics() && (
            <s.Topics>
              {topics.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </s.Topics>
          )}
        </div>
        <ArticleStatInfo
          cefr_level={cefr_level}
          articleInfo={article}
        ></ArticleStatInfo>
      </s.BottomContainer>
      {article.video ? (
        <img
          alt=""
          style={{ float: "left", marginRight: "1em" }}
          src={
            "https://img.youtube.com/vi/" +
            extractVideoIDFromURL(article.url) +
            "/default.jpg"
          }
        />
      ) : (
        ""
      )}
    </s.ArticlePreview>
  );
}
