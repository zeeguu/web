import * as s from "./ArticleSourceInfo.sc";
import { getNewsIconPath } from "../utils/misc/staticPath";
import { formatDistanceToNowStrict } from "date-fns";

export default function ArticleSourceInfo({ articleInfo, dontShowSourceIcon, dontShowPublishingTime, ...rest }) {
  return (
    <s.SourceContainer  {...rest}>
      {!dontShowSourceIcon && (
        <>
          <s.SourceImage>
            <img src={getNewsIconPath(articleInfo.feed_icon_name)} alt="" />
          </s.SourceImage>
          {articleInfo.feed_name && <s.FeedName>{articleInfo.feed_name}</s.FeedName>}
        </>
      )}
      {!dontShowPublishingTime && <s.PublishingTime>{formatDistanceToNowStrict(new Date(articleInfo.published), { addSuffix: true })}</s.PublishingTime>}
    </s.SourceContainer>
  );
}
