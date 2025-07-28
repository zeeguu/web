import { useState } from "react";
import { FEEDBACK_OPTIONS } from "./FeedbackConstants";
import FeedbackModal from "./FeedbackModal";
import NavOption from "./MainNav/NavOption";
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";
import { useFeedbackContext } from "../contexts/FeedbackContext";

export default function FeedbackButton({ screenWidth }) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { contextualInfo } = useFeedbackContext();
  
  return (
    <>
      <FeedbackModal
        prefixMsg={"Sidebar"}
        open={showFeedbackModal}
        setOpen={() => {
          setShowFeedbackModal(!showFeedbackModal);
        }}
        componentCategories={FEEDBACK_OPTIONS.ALL}
        contextualInfo={contextualInfo}
      ></FeedbackModal>
      <NavOption
        ariaHasPopup={"dialog"}
        icon={<FeedbackRoundedIcon />}
        screenWidth={screenWidth}
        text={"Give Feedback"}
        onClick={(e) => {
          e.stopPropagation();
          setShowFeedbackModal(!showFeedbackModal);
        }}
      />
    </>
  );
}
