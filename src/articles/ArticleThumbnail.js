import { topicIconFor } from "../utils/misc/topicIcon";
import * as s from "./SavedArticleRow.sc";

// The square at the start of an article row: the article's image, or a
// topic-matched glyph when it has none.
export default function ArticleThumbnail({ article }) {
  const PlaceholderIcon = topicIconFor(article.topics_list);
  return (
    <s.ThumbnailWrap>
      {article.img_url ? (
        <s.Thumbnail src={article.img_url} alt="" loading="lazy" decoding="async" />
      ) : (
        <s.Placeholder>
          <PlaceholderIcon style={{ fontSize: 32 }} />
        </s.Placeholder>
      )}
    </s.ThumbnailWrap>
  );
}
