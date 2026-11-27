import LearnedWordCard from "./LearnedWordCard";
import TopWordProgress from "./TopWordProgress";
import WordProgressBar from "../progressBars/WordProgressBar";
import { ExForm } from "../Exercises.sc";
import * as s from "../exerciseTypes/Exercise.sc";

export default {
  title: "Exercises/LearnedWordCard",
  component: LearnedWordCard,
};

// The card fills the free space of its column and centers the word in it.
const inAColumn = [
  (Story) => <div style={{ width: 390, height: 320, display: "flex", flexDirection: "column" }}>{Story()}</div>,
];

export const Default = {
  decorators: inAColumn,
  args: { bookmark: { id: 1, from: "slå op", to: "to look up" } },
};

export const LongPhrase = {
  decorators: inAColumn,
  args: { bookmark: { id: 2, from: "lade være med at", to: "refrain from" } },
};

const learnedBookmark = {
  id: 3,
  from: "taget",
  to: "the roof",
  level: 4,
  cooling_interval: 2,
  is_about_to_be_learned: true,
  is_last_in_cycle: true,
};

// The whole card after the answer that learned the word: the full bar, the
// "learned" line, the word, and Next at the bottom. Next is the bare button
// here; in the app it comes from NextNavigation, which needs the session.
export const OnTheExerciseCard = {
  decorators: [(Story) => <div style={{ width: 390 }}>{Story()}</div>],
  render: () => (
    <ExForm className="wordLearned" style={{ minHeight: 560 }}>
      <TopWordProgress
        exerciseType="Translate_L2_to_L1"
        progressBar={<WordProgressBar bookmark={learnedBookmark} message="C" />}
        learned
      />
      <LearnedWordCard bookmark={learnedBookmark} />
      <s.AfterAnswerFooter>
        <s.PrimaryExerciseButton>Next</s.PrimaryExerciseButton>
      </s.AfterAnswerFooter>
    </ExForm>
  ),
};
