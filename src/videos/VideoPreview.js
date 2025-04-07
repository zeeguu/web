import * as s from "../articles/ArticlePreview.sc";
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
  useEffect(() => {
    console.log(video);
  }, []);
  return (
    <s.ArticlePreview>
      <s.TitleContainer>
        <Link to={`/watch/${video.video_unique_key}`}>
          <s.Title>{video.title}</s.Title>
        </Link>
      </s.TitleContainer>

      <VideoSourceInfo video={video}></VideoSourceInfo>

      <s.ArticleContent>
        <Link
          style={{ position: "relative" }}
          to={`/watch/${video.video_unique_key}`}
        >
          <img src={video.thumbnail_url} alt={video.title} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(0, 0, 0, 0.5)",
              borderRadius: "50%",
              padding: "15px",
              color: "white",
            }}
          >
            <FaPlay size={20} />
          </div>
        </Link>
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
                <span
                  key={tuple[0]}
                  className={
                    tuple[1] === TopicOriginType.INFERRED ? "inferred" : "gold"
                  }
                >
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
    </s.ArticlePreview>
  );
}
