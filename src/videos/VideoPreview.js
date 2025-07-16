import * as s from "./VideoPreview.sc";
import { Link } from "react-router-dom";
import { TopicOriginType } from "../appConstants";
import VideoStatInfo from "./VideoStatInfo";
import VideoSourceInfo from "./VideoSourceInfo";
import { toast } from "react-toastify";
import { FaPlay } from "react-icons/fa";
import { darkBlue } from "../components/colors";
import { useState, useContext } from "react";
import ExplainTopicsModal from "../pages/ExplainTopicsModal";
import { TagsOfInterests } from "../articles/TagsOfInterests.sc";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { APIContext } from "../contexts/APIContext";
import TruncatedSummary from "../components/TruncatedSummary";

export default function VideoPreview({ video, notifyVideoClick }) {
  const [infoTopicClick, setInfoTopicClick] = useState("");
  const [showInfoTopics, setShowInfoTopics] = useState(false);
  const [showInferredTopic, setShowInferredTopic] = useState(true);
  const api = useContext(APIContext);

  // Redirect to the video page in the same window
  const handleTitleClick = () => {
    notifyVideoClick && notifyVideoClick();
    window.location.href = `/watch/video?id=${video.id}`;
  };

  let topics = video.topics_list;
  return (
    <s.VideoPreview>
      {showInfoTopics && (
        <TagsOfInterests>
          <ExplainTopicsModal
            infoTopicClick={infoTopicClick}
            showInfoTopics={showInfoTopics}
            setShowInfoTopics={setShowInfoTopics}
          />
        </TagsOfInterests>
      )}
      <s.TitleContainer>
        <s.Title>
          <Link onClick={() => notifyVideoClick && notifyVideoClick()} to={`/watch/video?id=${video.id}`}>
            {video.title}
          </Link>
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
        <s.Summary>
          <TruncatedSummary text={video.description} />
        </s.Summary>
      </s.ArticleContent>

      <s.BottomContainer>
        <div>
          {showInferredTopic && topics.length > 0 && (
            <s.UrlTopics>
              {topics.map(([topicTitle, topicOrigin]) => (
                <span
                  onClick={() => {
                    setShowInfoTopics(!showInfoTopics);
                    setInfoTopicClick(topicTitle);
                  }}
                  key={topicTitle}
                  className={topicOrigin === TopicOriginType.INFERRED ? "inferred" : "gold"}
                >
                  {topicTitle}
                  {topicOrigin === TopicOriginType.INFERRED && (
                    <HighlightOffRoundedIcon
                      className="cancelButton"
                      sx={{ color: darkBlue }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInferredTopic(false);
                        toast("Your preference was saved.");
                        api.removeMLSuggestion(video.source_id, topicTitle);
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
