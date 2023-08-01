import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import moment from "moment";
import * as s from "./ArticlePreview.sc";
import { MyBox, StyledCloseButton } from "../components/ExtensionMessage.sc"; //temporary added wrapper that belongs to the extension message
import Feature from "../features/Feature";
import { extractVideoIDFromURL } from "../utils/misc/youtube";

export default function ArticleOverview({
  article,
  dontShowPublishingTime,
  dontShowImage,
  hasExtension,
}) {
  const [isOpen, setIsOpen] = useState(false);

  let topics = article.topics.split(" ").filter((each) => each !== "");
  let difficulty = Math.round(article.metrics.difficulty * 100) / 10;

  function handleClose() {
    setIsOpen(false);
  }

  function handleOpen() {
    setIsOpen(true);
  }

  function titleLink(article) {
    let open_in_zeeguu = (
      <Link to={`/read/article?id=${article.id}`}>{article.title}</Link>
    );
    let open_externally = (
      //TODO: Refactor and add styling to the modal and article titles
      //Code related to the new redirection notification modal starts here
      //Temporarily added wrapper "MyBox" that belongs to the extension message styled component
      <>
        <Modal open={isOpen} onClose={handleClose}>
          <>
            <MyBox>
              <div>
                <h1>You’re now leaving to a third party site.</h1>
                <ol>
                  <li>
                    After entering the article's site <br></br>Find the
                    extension <br></br>in the top right corner <br></br> of your
                    browser
                  </li>
                  <li>Open the extension</li>
                  <li>
                    <strong>Happy reading!</strong>
                  </li>
                </ol>
              </div>

              <a target="_blank" rel="noreferrer" href={article.url}>
                <button>Go to the article's site</button>
                {/* {article.title} */}
              </a>
              <StyledCloseButton role="button" onClick={handleClose}>
                X
              </StyledCloseButton>
            </MyBox>
          </>
        </Modal>
        <button onClick={handleOpen}>{article.title}</button>
      </>
      //Code related to the new redirection notification modal ends here
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
    } else {
      return open_externally;
    }
  }

  return (
    <s.ArticlePreview>
      <s.Title>{titleLink(article)}</s.Title>
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
