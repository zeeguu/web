import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import { useState } from "react";
import FeedbackModal from "../../components/FeedbackModal";
import { FEEDBACK_OPTIONS } from "../../components/FeedbackConstants";
import RemoveBookmarkModal from "../removeBookmark/RemoveBookmarkModal";

export default function SolutionFeedbackLinks({
  isMatchExercise,
  matchBookmarks,
  prefixMsg,
  handleShowSolution,
  toggleShow,
  isCorrect,
}) {
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openFeedbackModal, setFeedbackModal] = useState(false);

  return (
    <s.CenteredRow className="margin-top-auto">
      <RemoveBookmarkModal
        matchBookmarks={matchBookmarks}
        open={openFeedbackModal}
        setOpen={setFeedbackModal}
        isMatchExercise={isMatchExercise}
      ></RemoveBookmarkModal>
      <FeedbackModal
        prefixMsg={prefixMsg}
        open={openFeedback}
        setOpen={setOpenFeedback}
        feedbackOptions={FEEDBACK_OPTIONS.EXERCISE}
      ></FeedbackModal>
      {!isCorrect && (
        <>
          <s.StyledGreyButton
            className="styledGreyButton"
            onClick={handleShowSolution}
          >
            {strings.showSolution}
          </s.StyledGreyButton>
          <s.StyledDiv>&nbsp;|&nbsp;</s.StyledDiv>
        </>
      )}
      <s.StyledGreyButton
        className="styledGreyButton"
        onClick={() => {
          setFeedbackModal(!openFeedbackModal);
        }}
      >
        {isMatchExercise
          ? strings.dontShowThisBookmarkMatchAgain
          : strings.dontShowThisBookmarkAgain}
      </s.StyledGreyButton>
      <s.StyledDiv>&nbsp;|&nbsp;</s.StyledDiv>
      <s.StyledGreyButton
        className="styledGreyButton"
        onClick={() => {
          setOpenFeedback(!openFeedback);
        }}
      >
        {strings.giveFeedback}
      </s.StyledGreyButton>
    </s.CenteredRow>
  );
}
