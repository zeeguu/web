import Match from "./exerciseTypes/match/Match";
import MultipleChoice from "./exerciseTypes/multipleChoice/MultipleChoice";
import FindWordInContext from "./exerciseTypes/findWordInContext/FindWordInContext";
import SpellWhatYouHear from "./exerciseTypes/spellWhatYouHear/SpellWhatYouHear";
import MultipleChoiceAudio from "./exerciseTypes/multipleChoiceAudio/MultipleChoiceAudio";
import OrderWordsL1 from "./exerciseTypes/orderWords/OrderWordsL1";
import OrderWordsL2 from "./exerciseTypes/orderWords/OrderWordsL2";
import FindWordInContextCloze from "./exerciseTypes/findWordInContextCloze/FindWordInContextCloze";
import TranslateL2toL1 from "./exerciseTypes/translateL2toL1/TranslateL2toL1";
import TranslateWhatYouHear from "./exerciseTypes/translateWhatYouHear/TranslateWhatYouHear";

const NUMBER_OF_BOOKMARKS_TO_PRACTICE = 10;

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

let RECALL_SEQUENCE = [
  {
    type: FindWordInContextCloze,
    requiredBookmarks: 2,
  },
  {
    type: TranslateL2toL1,
    requiredBookmarks: 4,
  },
  {
    type: TranslateWhatYouHear,
    requiredBookmarks: 4,
  }
];


export {
  DEFAULT_SEQUENCE,
  DEFAULT_SEQUENCE_NO_AUDIO,
  EXERCISE_TYPES_TIAGO,
  NUMBER_OF_BOOKMARKS_TO_PRACTICE,
  RECALL_SEQUENCE,
};
