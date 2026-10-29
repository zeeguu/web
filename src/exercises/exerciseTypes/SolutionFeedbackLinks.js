import { useEffect, useState } from "react";
import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import { toast } from "react-toastify";
import useScreenWidth from "../../hooks/useScreenWidth";
import useSoftKeyboardOpen from "../../hooks/useSoftKeyboardOpen";
import DisableAudioSession from "./DisableAudioSession";
import { EXERCISE_TYPES } from "../ExerciseTypeConstants";
import SessionStorage from "../../assorted/SessionStorage";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import ExplainWordButton from "./ExplainWordButton";

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
  onReportClick,
  isReported,
}) {
  const { isMobile } = useScreenWidth();
  const isSoftKeyboardOpen = useSoftKeyboardOpen();

  const [askingWhyRemove, setAskingWhyRemove] = useState(false);

  // A question left open on one word must not carry over to the next
  useEffect(() => setAskingWhyRemove(false), [exerciseBookmark?.user_word_id]);

  // "i_know_this" records the word as known; anything else as skipped
  function removeFromPractice(reason) {
    setAskingWhyRemove(false);
    if (onWordRemovedFromExercises && exerciseBookmark) {
      onWordRemovedFromExercises(reason, exerciseBookmark.user_word_id);
      toast.success(`"${exerciseBookmark.from}" removed from practice`);
    }
  }

  // While typing, these links sit under the keyboard and only push the
  // sentence off screen. They come back as soon as the keyboard closes.
  if (isSoftKeyboardOpen && !isExerciseOver) return null;

  const afterExerciseRowStyle = { gap: "1em", flexWrap: "wrap", marginBottom: isMobile ? "2rem" : "1rem" };

  const whyRemoveRow = (
    <s.CenteredWordRow style={afterExerciseRowStyle}>
      <span style={{ color: "var(--text-muted)", fontSize: "small", marginTop: "1em" }}>{strings.whyRemoveFromPractice}</span>
      <s.StyledGreyButton className="styledGreyButton" onClick={() => removeFromPractice("i_know_this")}>
        {strings.iAlreadyKnowIt}
      </s.StyledGreyButton>
      <s.StyledGreyButton className="styledGreyButton" onClick={() => removeFromPractice("not_worth_learning")}>
        {strings.notWorthLearning}
      </s.StyledGreyButton>
      <s.StyledGreyButton className="styledGreyButton" onClick={() => setAskingWhyRemove(false)}>
        {strings.cancel}
      </s.StyledGreyButton>
    </s.CenteredWordRow>
  );

  const afterExerciseRow = (
    <s.CenteredWordRow style={afterExerciseRowStyle}>
      {/* Hide "Remove from practice" only for Match, where multiple words are practiced at once */}
      {exerciseType !== EXERCISE_TYPES.match && (
        <s.StyledGreyButton className="styledGreyButton" onClick={() => setAskingWhyRemove(true)}>
          {strings.removeFromPractice}
        </s.StyledGreyButton>
      )}
      {exerciseType !== EXERCISE_TYPES.match && <ExplainWordButton bookmark={exerciseBookmark} />}
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
  );

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

      {isExerciseOver && (askingWhyRemove ? whyRemoveRow : afterExerciseRow)}

      {onReportClick && (
        <s.CenteredWordRow style={{ marginBottom: isMobile ? "1rem" : "0.5rem" }}>
          {isReported ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#999",
                fontSize: "0.75rem",
                gap: "0.25rem",
              }}
            >
              <FlagOutlinedIcon fontSize="small" />
              Reported
            </div>
          ) : (
            <button
              onClick={onReportClick}
              title="Report issue with this exercise"
              aria-label="Report issue with this exercise"
              style={{
                background: "none",
                border: "none",
                padding: "0.25rem",
                cursor: "pointer",
                color: "grey",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.75rem",
                opacity: 0.7,
              }}
            >
              <FlagOutlinedIcon fontSize="small" />
              Report
            </button>
          )}
        </s.CenteredWordRow>
      )}
    </>
  );
}
