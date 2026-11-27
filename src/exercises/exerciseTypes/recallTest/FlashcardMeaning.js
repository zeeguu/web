import RecallTest from "./RecallTest.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";

// The word alone: tap to reveal its meaning and self-grade.
const DIRECTION = {
  exerciseType: EXERCISE_TYPES.flashcardMeaning,
  headlineKey: "recallMeaningHeadline",
  prompt: (bookmark) => bookmark.from,
  answer: (bookmark) => bookmark.to,
  isL1Answer: true,
  selfGradeOnly: true,
};

export default function FlashcardMeaning(props) {
  return <RecallTest direction={DIRECTION} {...props} />;
}
