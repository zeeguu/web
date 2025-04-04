import * as s from "../articles/ArticlePreview.sc";
import { Link } from "react-router-dom";
import { TopicOriginType } from "../appConstants";
import VideoStatInfo from "./VideoStatInfo";
import VideoSourceInfo from "./VideoSourceInfo";

export default function VideoPreview({ video }) {

    const handleTitleClick = () => {
        const baseUrl = window.location.origin;
        const videoUrl = `${baseUrl}/watch/${video.video_unique_key}`;
        window.open(videoUrl, '_blank', 'noopener,noreferrer');
      };

    return (
        <s.ArticlePreview>
            <s.TitleContainer>
                <s.Title>
                    <Link to={`/watch/${video.video_unique_key}`} onClick={handleTitleClick}>{video.title}</Link>
                </s.Title>
            </s.TitleContainer>

            <VideoSourceInfo video={video}></VideoSourceInfo>

            <s.ArticleContent>
                <img src={video.thumbnail_url} alt={video.title} />
                <s.Summary>{video.description?.substring(0, 297)}...</s.Summary>
            </s.ArticleContent>

            <s.BottomContainer>
                <div> { /* Not sure if the surrounding div tag is needed */}
                {video.topic && (
                    <s.UrlTopics>
                        <span className={
                            video.topic.origin_type === TopicOriginType.INFERRED ? "inferred" : "gold"
                        }>
                            {video.topic.title}
                        </span>
                    </s.UrlTopics>
                )}
                </div>
                <VideoStatInfo video={video}></VideoStatInfo>
            </s.BottomContainer>
        </s.ArticlePreview>
    );
            
}
