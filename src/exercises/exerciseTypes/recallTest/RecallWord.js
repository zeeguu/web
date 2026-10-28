import RecallTest from "./RecallTest.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";

// The translation alone: type the word. Productive recall.
const DIRECTION = {
  exerciseType: EXERCISE_TYPES.recallWord,
  headlineKey: "recallWordHeadline",
  prompt: (bookmark) => bookmark.to,
  answer: (bookmark) => bookmark.from,
  isL1Answer: false,
  // Another word that means the same here ("tænker" for "synes").
  judgeAlternative: (api, ...args) => api.judgeClozeAlternative(...args),
};

export default function RecallWord(props) {
  return <RecallTest direction={DIRECTION} {...props} />;
}
