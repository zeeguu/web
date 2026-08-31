import SolutionFeedbackLinks from "../../exercises/exerciseTypes/SolutionFeedbackLinks";
import { EXERCISE_TYPES } from "../../exercises/ExerciseTypeConstants";

export default {
  title: "Text/SolutionFeedbackLinks",
  component: SolutionFeedbackLinks,
};

const exerciseBookmark = {
  from: "learn",
  to: "вчити",
  user_word_id: 1,
};

const commonArgs = {
  exerciseBookmark,
  exerciseType: EXERCISE_TYPES.translateL2toL1,
  onReportClick: () => {},
};

export const BeforeExercise = {
  args: {
    ...commonArgs,
    isExerciseOver: false,
    isReported: false,
  },
};

export const AfterExercise = {
  args: {
    ...commonArgs,
    isExerciseOver: true,
    isReported: false,
  },
};

export const WithShareLink = {
  args: {
    ...commonArgs,
    isExerciseOver: true,
    isReported: false,
    shareableUrl: "https://zeeguu.org/exercise/example",
  },
};

export const Reported = {
  args: {
    ...commonArgs,
    isExerciseOver: true,
    isReported: true,
  },
};
