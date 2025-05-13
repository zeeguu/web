import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import { useEffect, useState } from "react";
import FeedbackModal from "../../components/FeedbackModal";
import { FEEDBACK_OPTIONS } from "../../components/FeedbackConstants";
import RemoveBookmarkModal from "../removeBookmark/RemoveBookmarkModal";

export default function SolutionFeedbackLinks({
  isTestingMultipleBookmarks,
  exerciseBookmarks,
  prefixMsg,
  handleShowSolution,
  isExerciseOver,
  uploadUserFeedback,
}) {
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openQuickFeedbackModal, setQuickFeedbackModal] = useState(false);
  const [hasProvidedQuickFeedback, setHasProvidedQuickFeedback] = useState(false);

  useEffect(() => {
    setQuickFeedbackModal(false);
    setOpenFeedback(false);
    setHasProvidedQuickFeedback(false);
  }, [exerciseBookmarks]);

  return (
    <s.CenteredRow className="margin-top-auto">
      <RemoveBookmarkModal
        exerciseBookmarks={exerciseBookmarks}
        open={openQuickFeedbackModal}
        setOpen={setQuickFeedbackModal}
        isTestingMultipleBookmarks={isTestingMultipleBookmarks}
        uploadUserFeedback={uploadUserFeedback}
        setHasProvidedQuickFeedback={setHasProvidedQuickFeedback}
      ></RemoveBookmarkModal>
      <FeedbackModal
        prefixMsg={prefixMsg}
        open={openFeedback}
        setOpen={setOpenFeedback}
        feedbackOptions={FEEDBACK_OPTIONS.EXERCISE}
      ></FeedbackModal>
      {!isExerciseOver && (
        <>
          <s.StyledGreyButton className="styledGreyButton" onClick={handleShowSolution}>
            {strings.showSolution}
          </s.StyledGreyButton>
          <s.StyledDiv>&nbsp;|&nbsp;</s.StyledDiv>
        </>
      )}
      {isExerciseOver && !hasProvidedQuickFeedback && (
        <>
          <s.StyledGreyButton
            className="styledGreyButton"
            onClick={() => {
              setQuickFeedbackModal(!openQuickFeedbackModal);
            }}
          >
            {isTestingMultipleBookmarks ? "Don't show one of these words again" : "Don't show this word again"}
          </s.StyledGreyButton>
          <s.StyledDiv>&nbsp;|&nbsp;</s.StyledDiv>
        </>
      )}
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
