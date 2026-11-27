import RecallTest from "./RecallTest.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";

// The translation alone: tap to reveal the word and self-grade.
const DIRECTION = {
  exerciseType: EXERCISE_TYPES.flashcardWord,
  headlineKey: "flashcardWordHeadline",
  prompt: (bookmark) => bookmark.to,
  answer: (bookmark) => bookmark.from,
  isL1Answer: false,
  selfGradeOnly: true,
};

export default function FlashcardWord(props) {
  return <RecallTest direction={DIRECTION} {...props} />;
}
