import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import { useEffect, useState } from "react";
import FeedbackModal from "../../components/FeedbackModal";
import { FEEDBACK_CODES_NAME, FEEDBACK_OPTIONS } from "../../components/FeedbackConstants";
import { toast } from "react-toastify";
import useScreenWidth from "../../hooks/useScreenWidth";
import DisableAudioSession from "./DisableAudioSession";
import { EXERCISE_TYPES } from "../ExerciseTypeConstants";
import SessionStorage from "../../assorted/SessionStorage";

export default function SolutionFeedbackLinks({
  exerciseBookmarks,
  prefixMsg,
  handleShowSolution,
  isExerciseOver,
  bookmarkLearned,
  shareableUrl,
  exerciseType,
  disableAudio,
  setIsExerciseOver,
}) {
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openQuickFeedbackModal, setQuickFeedbackModal] = useState(false);
  const [hasProvidedQuickFeedback, setHasProvidedQuickFeedback] = useState(false);
  const { isMobile } = useScreenWidth();

  useEffect(() => {
    setQuickFeedbackModal(false);
    setOpenFeedback(false);
    setHasProvidedQuickFeedback(false);
  }, [exerciseBookmarks]);

  return (
    <>
      <s.CenteredWordRow
        className={!isExerciseOver ? "margin-top-auto" : ""}
        style={{
          flexDirection: isMobile ? "column" : "row",
          marginTop: !isExerciseOver ? "1rem" : "0",
          gap: "1rem",
          marginBottom: isMobile ? "2rem" : "1rem",
        }}
      >
        <FeedbackModal
          prefixMsg={prefixMsg}
          open={openFeedback}
          setOpen={setOpenFeedback}
          componentCategories={FEEDBACK_OPTIONS.EXERCISE}
          preselectedCategory={FEEDBACK_CODES_NAME.EXERCISE}
        ></FeedbackModal>
        {!isExerciseOver && (
          <>
            <s.StyledGreyButton className="styledGreyButton" onClick={handleShowSolution}>
              {strings.showSolution}
            </s.StyledGreyButton>
            {EXERCISE_TYPES.isAudioExercise(exerciseType) && SessionStorage.isAudioExercisesEnabled() && (
              <DisableAudioSession handleDisabledAudio={disableAudio} setIsCorrect={setIsExerciseOver} />
            )}
            {isMobile && (
              <s.StyledGreyButton
                className="styledGreyButton"
                onClick={() => {
                  setOpenFeedback(!openFeedback);
                }}
                style={{ marginTop: "1rem" }}
              >
                Feedback
              </s.StyledGreyButton>
            )}
          </>
        )}
      </s.CenteredWordRow>

      {isExerciseOver && (
        <s.CenteredWordRow style={{ gap: "1em", flexWrap: "wrap", marginBottom: isMobile ? "2rem" : "1rem" }}>
          <s.StyledGreyButton
            className="styledGreyButton"
            onClick={() => {
              setOpenFeedback(!openFeedback);
            }}
          >
            Feedback
          </s.StyledGreyButton>
          {shareableUrl && (
            <s.StyledGreyButton
              className="styledGreyButton"
              onClick={() => {
                navigator.clipboard
                  .writeText(shareableUrl)
                  .then(() => {
                    toast.success("Exercise link copied to clipboard!");
                  })
                  .catch((err) => {
                    toast.error("Failed to copy link to clipboard");
                  });
              }}
            >
              Share exercise
            </s.StyledGreyButton>
          )}
        </s.CenteredWordRow>
      )}
    </>
  );
}
