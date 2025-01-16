import * as s from "./ArticlePreview.sc";
import { TopicOriginType } from "../appConstants";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { darkBlue } from "../components/colors";
import { toast } from "react-toastify";
import { useState } from "react";
import * as sweetM from "./TagsOfInterests.sc";
import ExplainTopicsModal from "../pages/ExplainTopicsModal";

export default function ArticleTopics({ article, api }) {
  const [showInfoTopics, setShowInfoTopics] = useState(false);
  const [infoTopicClick, setInfoTopicClick] = useState("");
  const [showInferredTopic, setShowInferredTopic] = useState(true);

  let topics = article.topics_list;

  return (
    <div>
      {showInfoTopics && (
        <sweetM.TagsOfInterests>
          <ExplainTopicsModal
            infoTopicClick={infoTopicClick}
            showInfoTopics={showInfoTopics}
            setShowInfoTopics={setShowInfoTopics}
          />
        </sweetM.TagsOfInterests>
      )}
      {showInferredTopic && topics.length > 0 && (
        <s.UrlTopics>
          {topics.map((tuple) => (
            // Tuple (Topic Title, TopicOriginType)
            <span
              onClick={() => {
                setShowInfoTopics(!showInfoTopics);
                setInfoTopicClick(tuple[0]);
              }}
              key={tuple[0]}
              className={
                tuple[1] === TopicOriginType.INFERRED ? "inferred" : "gold"
              }
            >
              {tuple[0]}
              {tuple[1] === TopicOriginType.INFERRED && (
                <HighlightOffRoundedIcon
                  className="cancelButton"
                  sx={{ color: darkBlue }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInferredTopic(false);
                    toast("Your preference was saved.");
                    api.removeMLSuggestion(article.id, tuple[0]);
                  }}
                />
              )}
            </span>
          ))}
        </s.UrlTopics>
      )}
    </div>
  );
}
