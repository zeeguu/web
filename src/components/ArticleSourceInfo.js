import * as s from "./ArticleSourceInfo.sc";
import { getNewsIconPath } from "../utils/misc/staticPath";
import moment from "moment";

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
      {!dontShowPublishingTime && <s.PublishingTime>({moment.utc(articleInfo.published).fromNow()})</s.PublishingTime>}
    </s.SourceContainer>
  );
}
