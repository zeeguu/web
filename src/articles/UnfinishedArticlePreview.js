import { Link } from "react-router-dom";
import * as s from "./ArticlePreview.sc";
import moment from "moment";
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

  return (
    <s.ArticlePreview>
      <s.UnfinishedArticleContainer>
        <s.Title>{titleLink(article)}</s.Title>
        {article.img_url && <img alt="" src={article.img_url} />}
      </s.UnfinishedArticleContainer>
      <div>
        <s.UnfinishedArticleStats>
          ({moment.utc(article.time_last_read).fromNow()},{" "}
          {Math.round(article.last_reading_percentage * 100)}% read)
        </s.UnfinishedArticleStats>
      </div>
    </s.ArticlePreview>
  );
}
