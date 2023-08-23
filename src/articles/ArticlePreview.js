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
  checkboxChecked,
  setCheckboxChecked,
  useModal,
  setUseModal,
}) {
  const [isRedirectionModalOpen, setIsRedirectionModaOpen] = useState(false);

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
      //The RedirectionNotificationModal is displayed when the user clicks
      //the article's title from the recommendation list.
      //The modal informs the user that they are about to be redirected
      //to the original article's website and guides them on what steps
      //should be taken to start reading the said article with The Zeeguu Reader extension
      <>
        <RedirectionNotificationModal
          checkboxChecked={checkboxChecked}
          setCheckboxChecked={setCheckboxChecked}
          useModal={useModal}
          setUseModal={setUseModal}
          article={article}
          open={isRedirectionModalOpen}
          handleClose={handleClose}
        />
        <s.InvisibleTitleButton onClick={handleOpen}>
          {article.title}
        </s.InvisibleTitleButton>
      </>
    );
    //Todo: If the user selects the "do not show again" checkbox on the RedirectionNotificationModal,
    //clicking the article's title will send them directly to the original article's site.
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
    if (article.has_personal_copy || article.has_uploader) {
      return open_in_zeeguu;
    } else if (useModal === false) {
      return open_externally_with_modal;
      //TODO: Currently right after "do not show" checkbox is checked
      //the condition checkboxChecked === false and "open_externally_with_modal" no longer holds and the
      //modal disappears which results in not letting the user proceed to the article
      //by clicking the modal's "Go to article button" which results in a confusing flow.
      // To solve this I am considering to add an additional value
      //to the Logal storage that would be changed when  "Go to article button" is clicked
      // not right after the checkbox has been cheched
    } else return open_externally_without_modal;
  }

  return (
    <s.ArticlePreview>
      <s.Title>
        {titleLink(article)}
        <SmallSaveArticleButton api={api} article={article} />
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
