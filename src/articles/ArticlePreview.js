import { Link } from "react-router-dom";
import { useState } from "react";
import { isMobile } from "../utils/misc/browserDetection";
import * as s from "./ArticlePreview.sc";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";
import Feature from "../features/Feature";
import { extractVideoIDFromURL } from "../utils/misc/youtube";
import SmallSaveArticleButton from "./SmallSaveArticleButton";
import ArticleSourceInfo from "../components/ArticleSourceInfo";
import ArticleStatInfo from "../components/ArticleStatInfo";

export default function ArticlePreview({
  article,
  dontShowPublishingTime,
  dontShowSourceIcon,
  hasExtension,
  api,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
  onArticleClick,
  isUnfinishedArticle,
}) {
  const [isRedirectionModalOpen, setIsRedirectionModaOpen] = useState(false);
  const [isArticleSaved, setIsArticleSaved] = useState(
    article.has_personal_copy,
  );

  const handleArticleClick = () => {
    if (onArticleClick) {
      onArticleClick(article.id);
    }
  };

  let topics = article.topics.split(" ").filter((each) => each !== "");
  let cefr_level = article.metrics.cefr_level;

  function handleCloseRedirectionModal() {
    setIsRedirectionModaOpen(false);
  }

  function handleOpenRedirectionModal() {
    setIsRedirectionModaOpen(true);
  }

  function titleLink(article) {
    let linkToRedirect = `/read/article?id=${article.id}`;
    if (article.last_reading_percentage)
      linkToRedirect += `&percentage=${parseFloat(article.last_reading_percentage).toFixed(2)}`;
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
      {!isUnfinishedArticle && (
        <SmallSaveArticleButton
          api={api}
          article={article}
          isArticleSaved={isArticleSaved}
          setIsArticleSaved={setIsArticleSaved}
        />
      )}

      {isUnfinishedArticle && (
        <div>
          <s.UnfinishedArticleContainer>
            <s.Title>{titleLink(article)}</s.Title>
            {article.img_url && <img alt="" src={article.img_url} />}
          </s.UnfinishedArticleContainer>
          <div style={{ fontWeight: "550" }}>
            ({article.time_until_last_read},{" "}
            {Math.round(article.last_reading_percentage * 100)}% read)
          </div>
        </div>
      )}
      {!isUnfinishedArticle && (
        <>
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
            <s.Topics>
              {topics.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </s.Topics>
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
        </>
      )}
    </s.ArticlePreview>
  );
}
