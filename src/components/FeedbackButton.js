import { useState } from "react";
import FeedbackIcon from "@mui/icons-material/Feedback";
import FeedbackModal from "./FeedbackModal";
import { Tooltip } from "@mui/material";
import { FEEDBACK_OPTIONS } from "./FeedbackConstants";

export default function FeedbackButton() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  return (
    <>
      <FeedbackModal
        prefixMsg={"Sidebar"}
        open={showFeedbackModal}
        setOpen={() => {
          setShowFeedbackModal(!showFeedbackModal);
        }}
        feedbackOptions={FEEDBACK_OPTIONS.ALL}
      ></FeedbackModal>
      <Tooltip title="Give Feedback">
        <FeedbackIcon
          fontSize="large"
          className="navigationIcon"
          sx={{ color: "white" }}
          onClick={() => {
            setShowFeedbackModal(!showFeedbackModal);
          }}
        />
      </Tooltip>
    </>
  );
}
