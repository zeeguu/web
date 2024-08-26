import { Link } from "react-router-dom";
import * as s from "./ArticlePreview.sc";
import {
  secondsToMinutes,
  secondsToHours,
  getHumanRoundedTime,
} from "../utils/misc/readableTime";
export default function UnfinishedArticlePreview({ article, onArticleClick }) {
  const handleArticleClick = () => {
    if (onArticleClick) {
      onArticleClick(article.id);
    }
  };

  function titleLink(article) {
    let linkToRedirect = `/read/article?id=${article.id}`;
    if (article.last_reading_percentage)
      linkToRedirect += `&percentage=${parseFloat(article.last_reading_percentage).toFixed(2)}`;
    return (
      <Link to={linkToRedirect} onClick={handleArticleClick}>
        {article.title}
      </Link>
    );
  }
  function getDateString(article) {
    let seconds = article.seconds_since_read;
    if (secondsToMinutes(seconds) < 10) return "just now";
    if (secondsToMinutes(seconds) < 61)
      return getHumanRoundedTime(seconds, "minutes") + " ago";
    if (secondsToHours(seconds) < 25)
      return "about " + getHumanRoundedTime(seconds, "hours") + " ago";
    return "about " + getHumanRoundedTime(seconds, "days") + " ago";
  }

  return (
    <s.ArticlePreview>
      <s.UnfinishedArticleContainer>
        <s.Title>{titleLink(article)}</s.Title>
        {article.img_url && <img alt="" src={article.img_url} />}
      </s.UnfinishedArticleContainer>
      <div>
        <s.UnfinishedArticleStats>
          ({getDateString(article)},{" "}
          {Math.round(article.last_reading_percentage * 100)}% read)
        </s.UnfinishedArticleStats>
      </div>
    </s.ArticlePreview>
  );
}
