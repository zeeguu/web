import { useState } from "react";
import { toast } from "react-toastify";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { darkBlue } from "./colors";
import { TopicOriginType } from "../appConstants";
import * as s from "../articles/ArticlePreviewList.sc";
import ExplainTopicsModal from "../pages/ExplainTopicsModal";
import { TagsOfInterests } from "../articles/TagsOfInterests.sc";

export default function ArticleTopics({ 
  topics, 
  api, 
  articleId, 
  showInferredTopic, 
  setShowInferredTopic 
}) {
  const [infoTopicClick, setInfoTopicClick] = useState("");
  const [showInfoTopics, setShowInfoTopics] = useState(false);

  if (!showInferredTopic || !topics || topics.length === 0) {
    return null;
  }

  return (
    <>
      {showInfoTopics && (
        <TagsOfInterests>
          <ExplainTopicsModal
            infoTopicClick={infoTopicClick}
            showInfoTopics={showInfoTopics}
            setShowInfoTopics={setShowInfoTopics}
          />
        </TagsOfInterests>
      )}
      
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
                  api.removeMLSuggestion(articleId, topicTitle);
                }}
              />
            )}
          </span>
        ))}
      </s.UrlTopics>
    </>
  );
}