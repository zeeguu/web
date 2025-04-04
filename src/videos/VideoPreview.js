import * as s from "../articles/ArticlePreview.sc";
import { Link } from "react-router-dom";
import { TopicOriginType } from "../appConstants";
import VideoStatInfo from "./VideoStatInfo";
import VideoSourceInfo from "./VideoSourceInfo";
import { FaPlay } from "react-icons/fa";

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
                    <Link to={`/watch/${video.video_unique_key}`} onClick={handleTitleClick}>
                        {video.title}
                    </Link>
                </s.Title>
            </s.TitleContainer>

            <VideoSourceInfo video={video}></VideoSourceInfo>

            <s.ArticleContent>
                <Link style={{ position: 'relative' }} onClick={handleTitleClick}>
                    <img src={video.thumbnail_url} alt={video.title} />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '50%',
                        padding: '15px',
                        color: 'white'
                    }}>
                        <FaPlay size={20} />
                    </div>
                
                </Link>
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
