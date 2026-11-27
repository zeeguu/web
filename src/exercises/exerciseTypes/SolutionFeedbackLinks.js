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
import ChoiceModal from "../../components/modal_shared/ChoiceModal";

// The ways out of an exercise before answering it.
export function EscapeLinks({ onShowSolution, exerciseType, disableAudio, setIsExerciseOver }) {
  return (
    <>
      <s.StyledGreyButton className="styledGreyButton" onClick={onShowSolution}>
        {strings.showSolution}
      </s.StyledGreyButton>
      {EXERCISE_TYPES.isAudioExercise(exerciseType) && SessionStorage.isAudioExercisesEnabled() && (
        <DisableAudioSession handleDisabledAudio={disableAudio} setIsCorrect={setIsExerciseOver} />
      )}
    </>
  );
}

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
  // BottomInput shows Show solution and No audio now itself, under the input.
  linksUnderInput = false,
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

  const reportControl = onReportClick && (
    <s.ReportCorner>
      {isReported ? (
        <s.ReportedBadge>
          <FlagOutlinedIcon fontSize="small" />
          Reported
        </s.ReportedBadge>
      ) : (
        <s.ReportButton
          onClick={onReportClick}
          title="Report issue with this exercise"
          aria-label="Report issue with this exercise"
        >
          <FlagOutlinedIcon fontSize="small" />
        </s.ReportButton>
      )}
    </s.ReportCorner>
  );

  // While typing, these links sit under the keyboard and only push the
  // sentence off screen. They come back as soon as the keyboard closes.
  if (isSoftKeyboardOpen && !isExerciseOver) return null;

  const afterExerciseRowStyle = { gap: "1em", flexWrap: "wrap" };

  // Asked in a dialog: swapping the links row for the answers moved the
  // footer around under the learner's thumb.
  const whyRemoveDialog = askingWhyRemove && exerciseBookmark && (
    <ChoiceModal
      title={`${strings.removeFromPractice}: "${exerciseBookmark.from}"`}
      message={strings.whyRemoveFromPractice}
      primaryLabel={strings.iAlreadyKnowIt}
      secondaryLabel={strings.notWorthLearning}
      onPrimary={() => removeFromPractice("i_know_this")}
      onSecondary={() => removeFromPractice("not_worth_learning")}
      onCancel={() => setAskingWhyRemove(false)}
    />
  );

  const afterExerciseRow = (
    <s.ExerciseLinksRow style={afterExerciseRowStyle}>
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
    </s.ExerciseLinksRow>
  );

  return (
    <>
      {reportControl}

      {/* Before the answer: the escape hatches, unless the exercise shows them itself. */}
      {!isExerciseOver && !linksUnderInput && (
        <s.ExerciseLinksRow
          className="margin-top-auto"
          style={{ marginTop: "1rem", marginBottom: isMobile ? "1.5rem" : "1rem" }}
        >
          <EscapeLinks
            onShowSolution={handleShowSolution}
            exerciseType={exerciseType}
            disableAudio={disableAudio}
            setIsExerciseOver={setIsExerciseOver}
          />
        </s.ExerciseLinksRow>
      )}

      {isExerciseOver && afterExerciseRow}
      {isExerciseOver && whyRemoveDialog}
    </>
  );
}
