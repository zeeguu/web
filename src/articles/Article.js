// import './Article.css'
import { Link } from "react-router-dom";
import moment from "moment";
import * as s from "./Article.sc";

export default function Article({
  article,
  dontShowPublishingTime,
  dontShowImage,
}) {
  let topics = article.topics.split(" ").filter((each) => each !== "");
  let difficulty = Math.round(article.metrics.difficulty * 100) / 10;

  return (
    <s.IndividualArticle>
      <s.Header>
        <s.Title>
          <Link to={`/read/article?id=${article.id}`}>{article.title}</Link>
        </s.Title>
        <s.Difficulty>{difficulty}</s.Difficulty>
        <s.WordCount>{article.metrics.word_count}</s.WordCount>
      </s.Header>

      <div className="articleLinkSummary">{article.summary}</div>

      <div className="articleTopics">
        {!dontShowImage && (
          <div className="articleLinkImage">
            <img
              src={"/news-icons/" + article.icon_name}
              className="feedIcon"
              alt=""
            />
          </div>
        )}

        {!dontShowPublishingTime && (
          <span className="publishingTime">
            {moment.utc(article.published).fromNow()}
          </span>
        )}
        {topics.map((topic) => (
          <span key={topic} className="singleTopicTag">
            {topic}
          </span>
        ))}
      </div>
    </s.IndividualArticle>
  );
}
