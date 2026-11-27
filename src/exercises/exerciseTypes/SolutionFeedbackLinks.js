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
import FlagIcon from "@mui/icons-material/Flag";
import IosShareIcon from "@mui/icons-material/IosShare";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Tag from "../../pages/_pages_shared/Tag.sc";
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

  function shareExercise() {
    navigator.clipboard
      .writeText(shareableUrl)
      .then(() => toast.success("Exercise link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link to clipboard"));
  }

  const canShare = isExerciseOver && Boolean(shareableUrl);

  // Report and Share are rare, so they are two small gray icons in the
  // card's top-right corner, out of the way of the exercise and of Next.
  const cornerIcons = (onReportClick || canShare) && (
    <s.CornerIcons>
      {canShare && (
        <s.CornerIconButton
          type="button"
          aria-label="Share exercise"
          title="Share exercise"
          onClick={shareExercise}
        >
          <IosShareIcon fontSize="small" />
        </s.CornerIconButton>
      )}
      {onReportClick && (
        <s.CornerIconButton
          type="button"
          aria-label={isReported ? "Reported" : "Report a problem with this exercise"}
          title={isReported ? "Reported" : "Report a problem with this exercise"}
          disabled={isReported}
          onClick={onReportClick}
        >
          {isReported ? <FlagIcon fontSize="small" /> : <FlagOutlinedIcon fontSize="small" />}
        </s.CornerIconButton>
      )}
    </s.CornerIcons>
  );

  // While typing, these links sit under the keyboard and only push the
  // sentence off screen. They come back as soon as the keyboard closes.
  if (isSoftKeyboardOpen && !isExerciseOver) return null;

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
      moreOptions={[
        { label: strings.translationIsWrong, onClick: () => removeFromPractice("bad_translation") },
        { label: strings.other, onClick: () => removeFromPractice("other") },
      ]}
      onCancel={() => setAskingWhyRemove(false)}
    />
  );

  const afterExerciseRow = (
    <s.WordActions>
      {exerciseType !== EXERCISE_TYPES.match && <ExplainWordButton bookmark={exerciseBookmark} />}
      {/* Hide "Remove" only for Match, where multiple words are practiced at once */}
      {exerciseType !== EXERCISE_TYPES.match && (
        <Tag className="small" onClick={() => setAskingWhyRemove(true)}>
          <RemoveCircleOutlineIcon fontSize="inherit" />
          {strings.remove}
        </Tag>
      )}
    </s.WordActions>
  );

  return (
    <>
      {cornerIcons}

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
