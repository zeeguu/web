import { useState } from "react";
import FeedbackIcon from "@mui/icons-material/Feedback";
import FeedbackModal from "./FeedbackModal";
import { Tooltip } from "@mui/material";
import { FEEDBACK_OPTIONS } from "./FeedbackConstants";
import NavLink from "./sidebar/NavLInk";
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";

export default function FeedbackButton({ isCollapsed }) {
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
      <NavLink
        icon={<FeedbackRoundedIcon />}
        isCollapsed={isCollapsed}
        text={"Give Feedback"}
        isButton={true}
        onClick={() => {
          setShowFeedbackModal(!showFeedbackModal);
        }}
      />
    </>
  );
}
