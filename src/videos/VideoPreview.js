import * as s from "./VideoPreview.sc";
import { Link } from "react-router-dom";
import { TopicOriginType } from "../appConstants";
import VideoStatInfo from "./VideoStatInfo";
import VideoSourceInfo from "./VideoSourceInfo";
import { toast } from "react-toastify";
import { FaPlay } from "react-icons/fa";
import { HighlightOffRounded } from "@mui/icons-material";
import { darkBlue } from "../components/colors";
import { useEffect } from "react";

export default function VideoPreview({ video }) {
  // Redirect to the video page in the same window
  const handleTitleClick = () => {
    window.location.href = `/watch/video?id=${video.id}`;
  };

  useEffect(() => {
    console.log(video);
  }, []);
  return (
    <s.VideoPreview>
      <s.TitleContainer>
        <s.Title>
          <Link to={`/watch/video?id=${video.id}`}>{video.title}</Link>
        </s.Title>
      </s.TitleContainer>

      <VideoSourceInfo video={video}></VideoSourceInfo>

      <s.ArticleContent>
        <s.VideoThumbnail onClick={handleTitleClick}>
          <img src={video.thumbnail_url} alt={video.title} />
          <s.PlayButtonOverlay>
            <FaPlay size="1rem" />
          </s.PlayButtonOverlay>
        </s.VideoThumbnail>
        <s.Summary>{video.description?.substring(0, 297)}...</s.Summary>
      </s.ArticleContent>

      <s.BottomContainer>
        <div>
          {" "}
          {/* Not sure if the surrounding div tag is needed */}
          {video.topics_list && (
            <s.UrlTopics>
              {video.topics_list.map((tuple) => (
                // Tuple (Topic Title, TopicOriginType)
                <span key={tuple[0]} className={tuple[1] === TopicOriginType.INFERRED ? "inferred" : "gold"}>
                  {tuple[0]}
                  {tuple[1] === TopicOriginType.INFERRED && (
                    <HighlightOffRounded
                      className="cancelButton"
                      sx={{ color: darkBlue }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toast("Your preference was saved.");
                      }}
                    />
                  )}
                </span>
              ))}
            </s.UrlTopics>
          )}
        </div>
        <VideoStatInfo video={video}></VideoStatInfo>
      </s.BottomContainer>
    </s.VideoPreview>
  );
}
