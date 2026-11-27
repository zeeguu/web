import TopWordProgress from "./TopWordProgress";
import WordProgressBar from "../progressBars/WordProgressBar";

export default {
  title: "Exercises/TopWordProgress",
  component: TopWordProgress,
  decorators: [(Story) => <div style={{ width: 390, padding: "1rem 0" }}>{Story()}</div>],
};

const bookmark = {
  id: 1,
  from: "taget",
  level: 4,
  cooling_interval: 2,
  is_about_to_be_learned: true,
  is_last_in_cycle: true,
};

// After an answer: the word's bar at the top of the card.
export const AfterAnswer = {
  args: {
    exerciseType: "TranslateL2toL1",
    progressBar: <WordProgressBar bookmark={{ ...bookmark, is_about_to_be_learned: false, level: 2 }} message="C" />,
  },
};

// The answer that completes the word: one slim line under the full bar.
export const WordLearned = {
  args: {
    exerciseType: "TranslateL2toL1",
    learned: true,
    progressBar: <WordProgressBar bookmark={bookmark} message="C" />,
  },
};
