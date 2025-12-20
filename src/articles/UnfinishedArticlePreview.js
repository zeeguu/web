import { Link } from "react-router-dom";
import * as s from "./ArticlePreview.sc";
import { formatDistanceToNow } from "date-fns";
import ReadingCompletionProgress from "./ReadingCompletionProgress";
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
    <s.ArticlePreview style={{ border: "none" }}>
      <s.UnfinishedArticleContainer>
        {article.img_url && <img alt="" src={article.img_url} />}
        <s.Title className={article.opened ? "opened" : ""}>
          {titleLink(article)}
        </s.Title>
        <ReadingCompletionProgress
          last_reading_percentage={article.last_reading_percentage}
        ></ReadingCompletionProgress>
      </s.UnfinishedArticleContainer>
      <s.UnfinishedArticleStats>
        ({formatDistanceToNow(new Date(article.time_last_read), { addSuffix: true }).replace("about ", "")})
      </s.UnfinishedArticleStats>
    </s.ArticlePreview>
  );
}
