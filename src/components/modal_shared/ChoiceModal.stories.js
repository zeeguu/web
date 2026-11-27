import { fn } from "storybook/test";
import ChoiceModal from "./ChoiceModal";

export default {
  title: "Dialogs/ChoiceModal",
  component: ChoiceModal,
  args: {
    // fn() records each call in the Actions tab.
    onPrimary: fn(),
    onSecondary: fn(),
    onCancel: fn(),
  },
};

export const TwoAnswers = {
  args: {
    message: "Exit reader mode?",
    primaryLabel: "Exit",
    secondaryLabel: "Cancel",
  },
};

export const SecondaryAsLink = {
  args: {
    title: "Read this article?",
    message: "It is in Danish, the language you are learning.",
    primaryLabel: "Read it",
    secondaryLabel: "Save for later",
    secondaryAsLink: true,
  },
};

// Remove from practice: more than two answers.
export const MoreOptions = {
  args: {
    title: 'Remove from practice: "ved at"',
    message: "Why?",
    primaryLabel: "I already know it",
    secondaryLabel: "Not worth learning",
    moreOptions: [
      { label: "The translation is wrong", onClick: fn() },
      { label: "Other", onClick: fn() },
    ],
  },
};
