import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import { toast } from "react-toastify";
import useScreenWidth from "../../hooks/useScreenWidth";
import DisableAudioSession from "./DisableAudioSession";
import { EXERCISE_TYPES } from "../ExerciseTypeConstants";
import SessionStorage from "../../assorted/SessionStorage";

export default function SolutionFeedbackLinks({
  exerciseBookmarks,
  exerciseBookmark,
  handleShowSolution,
  isExerciseOver,
  shareableUrl,
  exerciseType,
  disableAudio,
  setIsExerciseOver,
  onWordRemovedFromExercises,
}) {
  const { isMobile } = useScreenWidth();

  function handleIKnowThisWord() {
    if (onWordRemovedFromExercises && exerciseBookmark) {
      onWordRemovedFromExercises("i_know_this", exerciseBookmark.user_word_id);
      toast.success(`"${exerciseBookmark.from}" removed from practice`);
    }
  }

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
        {!isExerciseOver && (
          <>
            <s.StyledGreyButton className="styledGreyButton" onClick={handleShowSolution}>
              {strings.showSolution}
            </s.StyledGreyButton>
            {EXERCISE_TYPES.isAudioExercise(exerciseType) && SessionStorage.isAudioExercisesEnabled() && (
              <DisableAudioSession handleDisabledAudio={disableAudio} setIsCorrect={setIsExerciseOver} />
            )}
          </>
        )}
      </s.CenteredWordRow>

      {isExerciseOver && (
        <s.CenteredWordRow style={{ gap: "1em", flexWrap: "wrap", marginBottom: isMobile ? "2rem" : "1rem" }}>
          {/* Hide "I know this word" for multi-bookmark exercises like Match */}
          {!EXERCISE_TYPES.isMultiBookmarkExercise(exerciseType) && (
            <s.StyledGreyButton className="styledGreyButton" onClick={handleIKnowThisWord}>
              {strings.iKnowThisWord}
            </s.StyledGreyButton>
          )}
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
