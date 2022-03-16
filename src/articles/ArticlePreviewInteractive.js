import { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import * as s from "./ArticlePreview.sc";
import { TranslatableText } from "../reader/TranslatableText";
import InteractiveText from "../reader/InteractiveText";
import { UMR_SOURCE } from "../reader/ArticleReader";
//TODO If this file is included in the running code, it should be localized:
//TODO import strings from "../i18n/definitions";

export default function ArticleOverview({
  article,
  dontShowPublishingTime,
  dontShowImage,
  api,
}) {
  let topics = article.topics.split(" ").filter((each) => each !== "");
  let difficulty = Math.round(article.metrics.difficulty * 100) / 10;

  const [openedInNewTab, setOpenedInNewTab] = useState(false);
  const [notInteresting, setNotInteresting] = useState(false);

  function handleOpen() {
    setOpenedInNewTab(true);
    window.open(`${article.url}`, "_blank");
  }

  function handleNotInteresting() {
    setNotInteresting(true);
  }

  if (!article.opened && openedInNewTab) {
    return (
      <s.ArticlePreview>
        <div style={{ backgroundColor: "orange" }}>
          <s.Title>{article.title}</s.Title>
          <s.Difficulty>{difficulty}</s.Difficulty>
          <s.WordCount>{article.metrics.word_count}</s.WordCount>
          <button>
            <Link to={`/read/article?id=${article.id}`}>
              Download and Study in Zeeguu
            </Link>
          </button>
          &nbsp;
          <button>Don't Like It</button> &nbsp;
          <button>Report Incomplete</button> &nbsp;
        </div>
      </s.ArticlePreview>
    );
  }

  let openedStyle = {};
  if (openedInNewTab) {
    openedStyle = { backgroundColor: "#dfb56e10" };
  }
  if (article.opened) {
    openedStyle = { backgroundColor: "#ffe59e10" };
  }

  if (notInteresting) {
    return <></>;
  }

  return (
    <s.ArticlePreview>
      <div style={openedStyle}>
          <s.Title>
            <TranslatableText
              interactiveText={new InteractiveText(article.title, article, api, UMR_SOURCE)}
              translating={true}
            />
          </s.Title>
          <s.Difficulty>{difficulty}</s.Difficulty>
          <s.WordCount>{article.metrics.word_count}</s.WordCount>
        <s.Summary>
          <TranslatableText
            interactiveText={new InteractiveText(article.summary, article, api, UMR_SOURCE)}
            translating={true}
          />
        </s.Summary>
        <button>
          <Link onClick={handleOpen}>Open</Link>
        </button>{" "}
        &nbsp;
        <button>
          <Link onClick={handleNotInteresting}>Not Interesting</Link>
        </button>{" "}
        {article.opened && (
          <button>
            <Link to={`/read/article?id=${article.id}`}>Study in Zeeguu</Link>
          </button>
        )}
        <br />
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
      </div>
    </s.ArticlePreview>
  );
}
