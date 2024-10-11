import * as s from "../articles/ArticlePreview.sc";
import Modal from "../components/modal_shared/Modal";
import { darkBlue } from "../components/colors";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

export default function ExplainTopicsModal({
  infoTopicClick,
  showInfoTopics,
  setShowInfoTopics,
}) {
  return (
    <Modal
      children={
        <>
          <h1>Article topics are shown differently!</h1>
          <div style={{ textAlign: "left", lineHeight: "2em" }}>
            <s.UrlTopics style={{ cursor: "default" }}>
              <span
                className="inferred"
                style={{ marginRight: "0.5em", cursor: "default" }}
              >
                {infoTopicClick}
                <HighlightOffRoundedIcon
                  className="cancelButton"
                  style={{ cursor: "default" }}
                  sx={{ color: darkBlue }}
                />
              </span>{" "}
              A dashed-line means that similar articles have been labeled with '
              {infoTopicClick}'. You can choose to remove them by clicking the
              cross.
            </s.UrlTopics>
            <s.UrlTopics style={{ cursor: "default" }}>
              <span
                className="gold"
                style={{ marginRight: "0.5em", cursor: "default" }}
              >
                {infoTopicClick}
              </span>{" "}
              The source associated with the article usually publishes '
              {infoTopicClick}'.
            </s.UrlTopics>
          </div>
        </>
      }
      open={showInfoTopics}
      onClose={() => {
        setShowInfoTopics(!showInfoTopics);
      }}
    ></Modal>
  );
}
