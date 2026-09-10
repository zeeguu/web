import LevelIndicator from "../../exercises/progressBars/levelIndicator/LevelIndicator";

export default {
  title: "Bars/LevelIndicator",
  component: LevelIndicator,
};

const bookmark = {
  from: "learn",
  to: "apprendre",
  level: 2,
  cooling_interval: 1,
  is_last_in_cycle: false,
};

export const InProgress = {
  args: {
    bookmark,
    userIsCorrect: false,
    userIsWrong: false,
    isGreyedOutBar: false,
  },
};

export const Correct = {
  args: {
    bookmark,
    userIsCorrect: true,
    userIsWrong: false,
    isGreyedOutBar: false,
  },
};

export const Incorrect = {
  args: {
    bookmark,
    userIsCorrect: false,
    userIsWrong: true,
    isGreyedOutBar: false,
  },
};

export const GreyedOut = {
  args: {
    bookmark: null,
    userIsCorrect: false,
    userIsWrong: false,
    isGreyedOutBar: true,
  },
};

export const NewBookmark = {
  args: {
    bookmark: {
      ...bookmark,
      level: 0,
      cooling_interval: null,
    },
    userIsCorrect: false,
    userIsWrong: false,
    isGreyedOutBar: false,
  },
};
