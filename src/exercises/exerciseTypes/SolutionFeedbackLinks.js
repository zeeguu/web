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
  bookmarkLearned,
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
    <s.CenteredWordRow className="margin-top-auto">
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
        </>
      )}
      {isExerciseOver && !hasProvidedQuickFeedback && !bookmarkLearned && (
        <>
          <s.StyledGreyButton
            className="styledGreyButton"
            onClick={() => {
              setQuickFeedbackModal(!openQuickFeedbackModal);
            }}
          >
            {/* keeping the code as a reminder that we used to have multiple options even though this
            is clear enough IMO even if it's the same */}
            {isTestingMultipleBookmarks ? "Exclude word from exercises" : "Exclude word from exercises"}
          </s.StyledGreyButton>
        </>
      )}
    </s.CenteredWordRow>
  );
}
