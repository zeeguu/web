import WordProgressBar from "../../exercises/progressBars/WordProgressBar";

export default {
  title: "Bars/WordProgressBar",
  component: WordProgressBar,
};

// Mock bookmark object
const mockBookmark = {
  id: 1,
  from: "learn",
  to: "apprendre",
  level: 2,
  cooling_interval: 1,
  is_last_in_cycle: false,
};

export const Correct = {
  args: {
    bookmark: mockBookmark,
    message: "C", // Correct on first try
    isGreyedOutBar: false,
  },
};

export const CorrectSecondTry = {
  args: {
    bookmark: mockBookmark,
    message: "TC", // Correct on second try
    isGreyedOutBar: false,
  },
};

export const Incorrect = {
  args: {
    bookmark: mockBookmark,
    message: "W", // Wrong answer (contains WRONG)
    isGreyedOutBar: false,
  },
};

export const GreyedOut = {
  args: {
    bookmark: mockBookmark,
    message: "C",
    isGreyedOutBar: true,
  },
};

export const NoMessage = {
  args: {
    bookmark: mockBookmark,
    message: null,
    isGreyedOutBar: false,
  },
};
