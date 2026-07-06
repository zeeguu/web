import * as s from "./ExplainTopicsModal.sc";
import Modal from "../components/modal_shared/Modal";
import { darkBlue } from "../components/colors";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

export default function ExplainTopicsModal({ infoTopicClick, showInfoTopics, setShowInfoTopics }) {
  return (
    <Modal
      children={
        <>
          <h1>Topics are shown differently!</h1>
          <s.ModalContent>
            <s.UrlTopics>
              <s.InferredTopic>
                {infoTopicClick}
                <s.CancelButton>
                  <HighlightOffRoundedIcon sx={{ color: darkBlue }} />
                </s.CancelButton>
              </s.InferredTopic>{" "}
              A dashed-line means that similar articles have been labeled with '{infoTopicClick}'. You can choose to
              remove them by clicking the cross.
            </s.UrlTopics>
            <s.UrlTopics>
              <s.GoldTopic>{infoTopicClick}</s.GoldTopic> The source associated with the article usually publishes '
              {infoTopicClick}'.
            </s.UrlTopics>
          </s.ModalContent>
        </>
      }
      open={showInfoTopics}
      onClose={() => {
        setShowInfoTopics(!showInfoTopics);
      }}
    ></Modal>
  );
}
