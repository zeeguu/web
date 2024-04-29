import strings from "../../../i18n/definitions.js";
import WordInContextExercise from "./WordInContextExercise.js";
import { exerciseTypes } from "../../ExerciseTypeConstants.js";
// The user has to click on the correct translation of a given L1 word in a L2 context.
// This tests the user's passive knowledge.

export default function ClickWordInContext({ ...props }) {
  return (
    <WordInContextExercise
      {...props}
      exerciseType={exerciseTypes.clickWordInContext}
      exerciseHeadline={strings.clickWordInContextHeadline}
      showBottomInput={false}
    />
  );
}
