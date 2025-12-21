import * as s from "../components/ArticleSourceInfo.sc";
import { formatDistanceToNow } from "date-fns";

export default function VideoSourceInfo({ video }) {
  return (
    <s.SourceContainer>
      <s.SourceImage>
        <img src={video.channel.thumbnail_url} alt="" />
      </s.SourceImage>
      <s.FeedName>{video.channel.name}</s.FeedName>
      <s.PublishingTime>({formatDistanceToNow(new Date(video.published_time), { addSuffix: true }).replace("about ", "")})</s.PublishingTime>
    </s.SourceContainer>
  );
}
