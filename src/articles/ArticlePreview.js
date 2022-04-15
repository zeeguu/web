import { Link } from "react-router-dom";
import moment from "moment";
import * as s from "./ArticlePreview.sc";
import Feature from "../features/Feature";
import { useState, useEffect } from "react";
import { checkExtensionInstalled } from "../utils/misc/extensionCommunication";
import {runningInChromeDesktop} from "../utils/misc/browserDetection";

export default function ArticleOverview({
  article,
  dontShowPublishingTime,
  dontShowImage,
}) {
  const [hasExtension, setHasExtension] = useState(false);

  useEffect(() => {
      checkExtensionInstalled(setHasExtension);
  }, []);

  let topics = article.topics.split(" ").filter((each) => each !== "");
  let difficulty = Math.round(article.metrics.difficulty * 100) / 10;

  function titleLink(article) {
    let open_in_zeeguu = (
      <Link to={`/read/article?id=${article.id}`}>{article.title}</Link>
    );
    let open_externally = (
      <a target="_blank" href={article.url}>
        {article.title}
      </a>
    );

    if (!Feature.extension_experiment1() && !hasExtension) {
      // if the feature is not enabled and if they don't have the extension we always open in zeeguu
      return open_in_zeeguu;
    }

    // else, we only open in zeegu if it's a personal copy or the article
    // has an uploader, thus it's uploaded from our own platform
    // either by the user themselves or by a teacher maybe
    if (article.has_personal_copy || article.has_uploader || !runningInChromeDesktop()) {
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
