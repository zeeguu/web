import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import * as s from "../exerciseTypes/Exercise.sc";
import strings from "../../i18n/definitions";
import { EXERCISE_TYPES, canLearnWithThisExercise } from "../ExerciseTypeConstants";
import { isWordLearned } from "../progressBars/levelIndicator/predictAfterAnswer";

// Whether the answer just given completed the word. Match practices several
// words at once, so it never counts here.
export function learnedByThisAnswer({ exerciseType, bookmark, message, isCorrect, isExerciseOver }) {
  if (!isExerciseOver || !isCorrect || !bookmark || exerciseType === EXERCISE_TYPES.match) return false;
  return isWordLearned({
    message,
    is_about_to_be_learned: bookmark.is_about_to_be_learned,
    is_last_in_cycle: bookmark.is_last_in_cycle,
    canLearn: canLearnWithThisExercise(bookmark, exerciseType),
  });
}

// The word's progress bar, at the very top of the exercise card, the same
// for every exercise type: next to the sentence, never between it and the
// example dots. Its space is kept before the answer too, so the sentence
// does not jump down when the bar appears. When this answer completed the
// word (`learned`), one slim line says so right under the bar that just
// filled up. Match practices several words at once, so it has no single bar.
export default function TopWordProgress({ exerciseType, progressBar, learned = false }) {
  if (exerciseType === EXERCISE_TYPES.match) return null;
  return (
    <>
      <s.TopProgressSlot $visible={Boolean(progressBar)}>{progressBar}</s.TopProgressSlot>
      {learned && (
        <s.WordLearnedLine>
          <SchoolOutlinedIcon fontSize="inherit" />
          {strings.wordLearned}
        </s.WordLearnedLine>
      )}
    </>
  );
}
