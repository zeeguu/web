import * as s from "../components/ArticleSourceInfo.sc";
import moment from "moment";

export default function VideoSourceInfo({ video }) {
  return (
    <s.SourceContainer>
      <s.SourceImage>
        <img src={video.channel.thumbnail_url} alt="" />
      </s.SourceImage>
      <s.FeedName>{video.channel.name}</s.FeedName>
      <s.PublishingTime>
        ({moment.utc(video.published_at).fromNow()})
      </s.PublishingTime>
    </s.SourceContainer>
  );
}
