import Match from "./exerciseTypes/match/Match";
import MultipleChoice from "./exerciseTypes/multipleChoice/MultipleChoice";
import FindWordInContext from "./exerciseTypes/wordInContextExercises/FindWordInContext";
import SpellWhatYouHear from "./exerciseTypes/spellWhatYouHear/SpellWhatYouHear";
import MultipleChoiceAudio from "./exerciseTypes/multipleChoiceAudio/MultipleChoiceAudio";
import OrderWordsL1 from "./exerciseTypes/orderWords/OrderWordsL1";
import OrderWordsL2 from "./exerciseTypes/orderWords/OrderWordsL2";
import FindWordInContextCloze from "./exerciseTypes/findWordInContextCloze/FindWordInContextCloze";
import TranslateL2toL1 from "./exerciseTypes/translateL2toL1/TranslateL2toL1";
import TranslateWhatYouHear from "./exerciseTypes/translateWhatYouHear/TranslateWhatYouHear";
import MultipleChoiceL2toL1 from "./exerciseTypes/multipleChoiceL2toL1/MultipleChoiceL2toL1";
import ClickWordInContext from "./exerciseTypes/wordInContextExercises/ClickWordInContext";
import MultipleChoiceContext from "./exerciseTypes/multipleChoiceContext/MultipleChoiceContext";

export function getNumberOfBookmarksToPractice(sequenceType) {
  if (
    sequenceType === LEARNING_CYCLE_SEQUENCE ||
    sequenceType === LEARNING_CYCLE_SEQUENCE_NO_AUDIO
  ) {
    return 12;
  } else {
    return 10;
  }
}

let DEFAULT_SEQUENCE = [
  {
    type: Match,
    requiredBookmarks: 3,
  },
  {
    type: MultipleChoice,
    requiredBookmarks: 1,
  },
  {
    type: FindWordInContext,
    requiredBookmarks: 1,
  },
  {
    type: SpellWhatYouHear,
    requiredBookmarks: 1,
  },
  {
    type: MultipleChoiceAudio,
    requiredBookmarks: 3,
  },
  {
    type: FindWordInContext,
    requiredBookmarks: 1,
  },
];

let EXERCISE_TYPES_TIAGO = [
  {
    type: MultipleChoice,
    requiredBookmarks: 1,
  },
  {
    type: FindWordInContext,
    requiredBookmarks: 1,
  },
  {
    type: Match,
    requiredBookmarks: 3,
  },
  {
    type: FindWordInContext,
    requiredBookmarks: 1,
  },
  {
    type: OrderWordsL2,
    requiredBookmarks: 1,
  },
  {
    type: OrderWordsL1,
    requiredBookmarks: 1,
  },
];

let DEFAULT_SEQUENCE_NO_AUDIO = [
  {
    type: MultipleChoice,
    requiredBookmarks: 1,
  },
  {
    type: Match,
    requiredBookmarks: 3,
  },
  {
    type: MultipleChoice,
    requiredBookmarks: 1,
  },
  {
    type: FindWordInContext,
    requiredBookmarks: 1,
  },
  {
    type: Match,
    requiredBookmarks: 3,
  },
  {
    type: FindWordInContext,
    requiredBookmarks: 1,
  },
];

let LEARNING_CYCLE_SEQUENCE = [
  {
    type: Match,
    requiredBookmarks: 3,
    learningCycle: "receptive",
  },
  {
    type: MultipleChoiceL2toL1,
    requiredBookmarks: 3,
    learningCycle: "receptive",
  },
  {
    type: TranslateL2toL1,
    requiredBookmarks: 1,
    learningCycle: "receptive",
  },
  {
    type: TranslateWhatYouHear,
    requiredBookmarks: 1,
    learningCycle: "receptive",
  },
  {
    type: MultipleChoiceContext,
    requiredBookmarks: 3,
    learningCycle: "receptive",
  },
  {
    type: ClickWordInContext,
    requiredBookmarks: 1,
    learningCycle: "receptive",
  },
  {
    type: MultipleChoice,
    requiredBookmarks: 3,
    learningCycle: "productive",
  },
  {
    type: SpellWhatYouHear,
    requiredBookmarks: 1,
    learningCycle: "productive",
  },
  {
    type: FindWordInContextCloze,
    requiredBookmarks: 1,
    learningCycle: "productive",
  },
  {
    type: MultipleChoiceAudio,
    requiredBookmarks: 3,
    learningCycle: "productive",
  },
];

let LEARNING_CYCLE_SEQUENCE_NO_AUDIO = [
  {
    type: Match,
    requiredBookmarks: 3,
    learningCycle: "receptive",
  },
  {
    type: MultipleChoiceL2toL1,
    requiredBookmarks: 3,
    learningCycle: "receptive",
  },
  {
    type: TranslateL2toL1,
    requiredBookmarks: 1,
    learningCycle: "receptive",
  },
  {
    type: ClickWordInContext,
    requiredBookmarks: 1,
    learningCycle: "receptive",
  },
  {
    type: MultipleChoiceContext,
    requiredBookmarks: 3,
    learningCycle: "receptive",
  },
  {
    type: FindWordInContextCloze,
    requiredBookmarks: 1,
    learningCycle: "productive",
  },
  {
    type: MultipleChoice,
    requiredBookmarks: 3,
    learningCycle: "productive",
  },
];

export {
  DEFAULT_SEQUENCE,
  DEFAULT_SEQUENCE_NO_AUDIO,
  EXERCISE_TYPES_TIAGO,
  LEARNING_CYCLE_SEQUENCE,
  LEARNING_CYCLE_SEQUENCE_NO_AUDIO,
};
