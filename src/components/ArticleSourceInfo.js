import * as s from "./ArticleSourceInfo.sc";
import { formatDistanceToNow } from "date-fns";

export default function ArticleSourceInfo({ articleInfo, dontShowPublishingTime }) {
  return (
    <s.SourceContainer>
      {articleInfo.feed_name && <s.FeedName>{articleInfo.feed_name}</s.FeedName>}
      {!dontShowPublishingTime && <s.PublishingTime>({formatDistanceToNow(new Date(articleInfo.published), { addSuffix: true }).replace("about ", "")})</s.PublishingTime>}
    </s.SourceContainer>
  );
}
