import RecallTest from "./RecallTest.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";

// The word alone: type what it means. Receptive recall.
const DIRECTION = {
  exerciseType: EXERCISE_TYPES.recallMeaning,
  headlineKey: "recallMeaningHeadline",
  prompt: (bookmark) => bookmark.from,
  answer: (bookmark) => bookmark.to,
  isL1Answer: true,
  // Another translation ("consult" for "slå op").
  judgeAlternative: (api, ...args) => api.judgeTranslationAlternative(...args),
};

export default function RecallMeaning(props) {
  return <RecallTest direction={DIRECTION} {...props} />;
}
