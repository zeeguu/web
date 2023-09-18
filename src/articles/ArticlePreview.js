import { Link } from "react-router-dom";
import { useState } from "react";
import moment from "moment";
import * as s from "./ArticlePreview.sc";
import RedirectionNotificationModal from "../components/RedirectionNotificationModal";
import Feature from "../features/Feature";
import { extractVideoIDFromURL } from "../utils/misc/youtube";
import SmallSaveArticleButton from "./SmallSaveArticleButton";

export default function ArticleOverview({
  article,
  dontShowPublishingTime,
  dontShowImage,
  hasExtension,
  api,
  selectedDoNotShowRedirectionModal_Checkbox,
  setSelectedDoNotShowRedirectionModal_Checkbox,
  openedExternallyWithoutModal,
  setOpenedExternallyWithoutModal,
}) {
  const [isRedirectionModalOpen, setIsRedirectionModaOpen] = useState(false);
  const [isArticleSaved, setIsArticleSaved] = useState(
    article.has_personal_copy
  );

  let topics = article.topics.split(" ").filter((each) => each !== "");
  let difficulty = Math.round(article.metrics.difficulty * 100) / 10;

  function handleClose() {
    setIsRedirectionModaOpen(false);
  }

  function handleOpen() {
    setIsRedirectionModaOpen(true);
  }

  function titleLink(article) {
    let open_in_zeeguu = (
      <Link to={`/read/article?id=${article.id}`}>{article.title}</Link>
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
          article={article}
          open={isRedirectionModalOpen}
          handleClose={handleClose}
          selectedDoNotShowRedirectionModal_Checkbox={
            selectedDoNotShowRedirectionModal_Checkbox
          }
          setSelectedDoNotShowRedirectionModal_Checkbox={
            setSelectedDoNotShowRedirectionModal_Checkbox
          }
          setOpenedExternallyWithoutModal={setOpenedExternallyWithoutModal}
          setIsArticleSaved={setIsArticleSaved}
        />
        <s.InvisibleTitleButton onClick={handleOpen}>
          {article.title}
        </s.InvisibleTitleButton>
      </>
    );
    let open_externally_without_modal = (
      <a target="_blank" rel="noreferrer" href={article.url}>
        {article.title}
      </a>
    );

    if (article.video) {
      return open_in_zeeguu;
    }

    if (!Feature.extension_experiment1() && !hasExtension) {
      // if the feature is not enabled and if they don't have the extension we always open in zeeguu
      return open_in_zeeguu;
    }

    // else, we only open in zeegu if it's a personal copy or the article
    // has an uploader, thus it's uploaded from our own platform
    // either by the user themselves or by a teacher maybe
    if (
      article.has_personal_copy ||
      article.has_uploader ||
      isArticleSaved === true
    ) {
      return open_in_zeeguu;
    } else if (openedExternallyWithoutModal === false) {
      return open_externally_with_modal;
    } else return open_externally_without_modal;
  }

  return (
    <s.ArticlePreview>
      <s.Title>
        {titleLink(article)}
        <SmallSaveArticleButton
          api={api}
          article={article}
          isArticleSaved={isArticleSaved}
          setIsArticleSaved={setIsArticleSaved}
        />
      </s.Title>
      <s.Difficulty>{difficulty}</s.Difficulty>
      <s.WordCount>{article.metrics.word_count}</s.WordCount>

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

      <s.Summary>{article.summary}</s.Summary>
      {!dontShowImage && (
        <s.SourceImage>
          <img src={"/news-icons/" + article.icon_name} alt="" />
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
    </s.ArticlePreview>
  );
}
