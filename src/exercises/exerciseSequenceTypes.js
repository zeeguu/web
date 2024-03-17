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
import MultipleChoiceL2toL1 from "./exerciseTypes/multipleChoiceL2toL1/MultipleChoiceL2toL1";
import ClickWordInContext from "./exerciseTypes/clickWordInContext/ClickWordInContext";
import MultipleChoiceContext from "./exerciseTypes/multipleChoiceContext/MultipleChoiceContext";

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

let PASSIVE_SEQUENCE = [
  {
    type: Match,
    requiredBookmarks: 3,
  },
  {
    type: MultipleChoiceL2toL1,
    requiredBookmarks: 3,
  },
  {
    type: TranslateL2toL1,
    requiredBookmarks: 1,
  },
  {
    type: TranslateWhatYouHear,
    requiredBookmarks: 1,
  },
  {
    type: MultipleChoiceContext,
    requiredBookmarks: 3,
  }
];

let PASSIVE_SEQUENCE_NO_AUDIO = [
  {
    type: Match,
    requiredBookmarks: 3,
  },
  {
    type: MultipleChoiceL2toL1,
    requiredBookmarks: 3,
  },
  {
    type: TranslateL2toL1,
    requiredBookmarks: 1,
  },
  {
    type: MultipleChoiceContext,
    requiredBookmarks: 3,
  }
];


let ACTIVE_SEQUENCE = [
  // {
  //   type: MultipleChoice,
  //   requiredBookmarks: 3,
  // },
  {
    type: MultipleChoiceContext,
    requiredBookmarks: 3,
  },
  {
    type: MultipleChoiceContext,
    requiredBookmarks: 3,
  },
  {
    type: ClickWordInContext,
    requiredBookmarks: 1,
  },
  {
    type: ClickWordInContext,
    requiredBookmarks: 1,
  },
  // {
  //   type: SpellWhatYouHear,
  //   requiredBookmarks: 1,
  // },
  {
    type: FindWordInContextCloze,
    requiredBookmarks: 1,
  },
  // {
  //   type: MultipleChoiceAudio,
  //   requiredBookmarks: 3,
  // },
  {
    type: ClickWordInContext,
    requiredBookmarks: 1,
  },
];

let ACTIVE_SEQUENCE_NO_AUDIO = [
  {
    type: MultipleChoice,
    requiredBookmarks: 3,
  },
  {
    type: FindWordInContextCloze,
    requiredBookmarks: 1,
  },
  {
    type: ClickWordInContext,
    requiredBookmarks: 1,
  },
  {
    type: MultipleChoice,
    requiredBookmarks: 3,
  },
  {
    type: FindWordInContextCloze,
    requiredBookmarks: 1,
  },
  {
    type: ClickWordInContext,
    requiredBookmarks: 1,
  },
];

export {
  DEFAULT_SEQUENCE,
  DEFAULT_SEQUENCE_NO_AUDIO,
  EXERCISE_TYPES_TIAGO,
  NUMBER_OF_BOOKMARKS_TO_PRACTICE,
  PASSIVE_SEQUENCE,
  ACTIVE_SEQUENCE,
  PASSIVE_SEQUENCE_NO_AUDIO,
  ACTIVE_SEQUENCE_NO_AUDIO,
};
