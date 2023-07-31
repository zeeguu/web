import { Link } from "react-router-dom";
import {useState} from "react";
import Modal from "@mui/material/Modal";
import moment from "moment";
import * as s from "./ArticlePreview.sc";
import Feature from "../features/Feature";
import { extractVideoIDFromURL } from "../utils/misc/youtube";

export default function ArticleOverview({
  article,
  dontShowPublishingTime,
  dontShowImage,
  hasExtension,
}) {
  const [isOpen, setIsOpen] = useState(false)

  let topics = article.topics.split(" ").filter((each) => each !== "");
  let difficulty = Math.round(article.metrics.difficulty * 100) / 10;

  function handleClose(){
    setIsOpen(false);
  }

  function handleOpen() {
    setIsOpen(true)
  }


  function titleLink(article) {
    let open_in_zeeguu = (
      <Link to={`/read/article?id=${article.id}`}>{article.title}</Link>
    );
    let open_externally = (
      // related to the new modal
      <>
      <Modal open={isOpen} onClose={handleClose}>
        <>
      <div>
        Beware; there be monsters!
      </div>

      <a target="_blank" rel="noreferrer" href={article.url}>
        {article.title}
      </a>
        </>
      </Modal>
      <button onClick={handleOpen}>{article.title}</button>
      </>
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
