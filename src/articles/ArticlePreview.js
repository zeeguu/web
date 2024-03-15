import { Link } from "react-router-dom";
import { useState } from "react";
import moment from "moment";
import { isMobile } from "../utils/misc/browserDetection";
import * as s from "./ArticlePreview.sc";
import RedirectionNotificationModal from "../components/redirect_notification/RedirectionNotificationModal";
import Feature from "../features/Feature";
import { extractVideoIDFromURL } from "../utils/misc/youtube";
import SmallSaveArticleButton from "./SmallSaveArticleButton";

export default function ArticleOverview({
  article,
  dontShowPublishingTime,
  dontShowSourceIcon,
  hasExtension,
  api,
  doNotShowRedirectionModal_UserPreference,
  setDoNotShowRedirectionModal_UserPreference,
  onArticleClick,
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
  let difficulty = Math.round(article.metrics.difficulty * 100) / 10;

  function handleCloseRedirectionModal() {
    setIsRedirectionModaOpen(false);
  }

  function handleOpenRedirectionModal() {
    setIsRedirectionModaOpen(true);
  }

  function titleLink(article) {
    let open_in_zeeguu = (
      <Link to={`/read/article?id=${article.id}`} onClick={handleArticleClick}>
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
      <SmallSaveArticleButton
        api={api}
        article={article}
        isArticleSaved={isArticleSaved}
        setIsArticleSaved={setIsArticleSaved}
      />

      <s.Title>{titleLink(article)}</s.Title>
      <s.ArticleContent>
        {article.img_url && <img alt="" src={article.img_url} />}
        <s.Summary>{article.summary}</s.Summary>
        <div className="stats">
          <s.Difficulty>{difficulty}</s.Difficulty>
          <s.WordCount style={{ marginRight: "1em" }}>
            {article.metrics.word_count}
          </s.WordCount>
        </div>
      </s.ArticleContent>

      <div>
        {!dontShowSourceIcon && (
          <s.SourceImage>
            <img src={"/news-icons/" + article.feed_icon_name} alt="" />
          </s.SourceImage>
        )}
        {!dontShowPublishingTime && (
          <s.PublishingTime>
            ({moment.utc(article.published).fromNow()})
          </s.PublishingTime>
        )}
        <s.Topics>
          {topics.map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </s.Topics>
      </div>
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
