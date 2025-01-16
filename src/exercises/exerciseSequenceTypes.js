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
import { MEMORY_TASK } from "./ExerciseTypeConstants";

const DEFAULT_NUMBER_BOOKMARKS_TO_PRACTICE = 12;
const MAX_NUMBER_OF_BOOKMARKS_EX_SESSION = 20;

const EX_Match = {
  type: Match,
  requiredBookmarks: 3,
  learningCycle: "receptive",
  memoryTask: MEMORY_TASK.RECOGNITION,
  testedBookmarks: 2,
};
const EX_MultipleChoice = {
  type: MultipleChoice,
  requiredBookmarks: 1,
  learningCycle: "productive",
  memoryTask: MEMORY_TASK.RECOGNITION,
  testedBookmarks: 1,
};
const EX_FindWordInContext = {
  type: FindWordInContext,
  requiredBookmarks: 1,
  testedBookmarks: 1,
};
const EX_SpellWhatYouHear = {
  type: SpellWhatYouHear,
  requiredBookmarks: 1,
  learningCycle: "productive",
  memoryTask: MEMORY_TASK.RECALL,
  testedBookmarks: 1,
};
const EX_MultipleChoiceL2toL1 = {
  type: MultipleChoiceL2toL1,
  requiredBookmarks: 3,
  learningCycle: "receptive",
  memoryTask: MEMORY_TASK.RECOGNITION,
  testedBookmarks: 1,
};
const EX_TranslateL2toL1 = {
  type: TranslateL2toL1,
  requiredBookmarks: 1,
  learningCycle: "receptive",
  memoryTask: MEMORY_TASK.RECALL,
  testedBookmarks: 1,
};
const EX_TranslateWhatYouHear = {
  type: TranslateWhatYouHear,
  requiredBookmarks: 1,
  learningCycle: "receptive",
  memoryTask: MEMORY_TASK.RECALL,
  testedBookmarks: 1,
};
const EX_MultipleChoiceContext = {
  type: MultipleChoiceContext,
  requiredBookmarks: 3,
  learningCycle: "receptive",
  memoryTask: MEMORY_TASK.RECOGNITION,
  testedBookmarks: 1,
};
const EX_ClickWordInContext = {
  type: ClickWordInContext,
  requiredBookmarks: 1,
  learningCycle: "receptive",
  memoryTask: MEMORY_TASK.RECOGNITION,
  testedBookmarks: 1,
};
const EX_FindWordInContextCloze = {
  type: FindWordInContextCloze,
  requiredBookmarks: 1,
  learningCycle: "productive",
  memoryTask: MEMORY_TASK.RECALL,
  testedBookmarks: 1,
};
const EX_MultipleChoiceAudio = {
  type: MultipleChoiceAudio,
  requiredBookmarks: 3,
  learningCycle: "productive",
  memoryTask: MEMORY_TASK.RECOGNITION,
  testedBookmarks: 1,
};
const EX_OrderWordsL2 = { type: OrderWordsL2, requiredBookmarks: 1 };
const EX_OrderWordsL1 = { type: OrderWordsL1, requiredBookmarks: 1 };

let DEFAULT_SEQUENCE = [
  EX_Match,
  EX_MultipleChoice,
  EX_FindWordInContext,
  EX_MultipleChoiceAudio,
  EX_SpellWhatYouHear,
  EX_FindWordInContext,
];

let EXERCISE_TYPES_TIAGO = [
  EX_MultipleChoice,
  EX_FindWordInContext,
  EX_Match,
  EX_FindWordInContext,
  EX_Match,
  EX_FindWordInContext,
  EX_OrderWordsL2,
  EX_OrderWordsL1,
];

let DEFAULT_SEQUENCE_NO_AUDIO = [
  EX_MultipleChoice,
  EX_Match,
  EX_MultipleChoice,
  EX_FindWordInContext,
  EX_Match,
  EX_FindWordInContext,
];

let LEARNING_CYCLE_SEQUENCE = [
  EX_Match,
  EX_MultipleChoiceL2toL1,
  EX_TranslateL2toL1,
  EX_TranslateWhatYouHear,
  EX_MultipleChoiceContext,
  EX_ClickWordInContext,
  EX_MultipleChoice,
  EX_SpellWhatYouHear,
  EX_FindWordInContextCloze,
  EX_MultipleChoiceAudio,
];

let LEARNING_CYCLE_SEQUENCE_NO_AUDIO = [
  EX_Match,
  EX_Match,
  EX_MultipleChoiceL2toL1,
  EX_TranslateL2toL1,
  EX_ClickWordInContext,
  EX_MultipleChoiceContext,
  EX_FindWordInContextCloze,
  EX_MultipleChoice,
];

let ALL_EXERCISES = [
  EX_Match,
  EX_MultipleChoice,
  EX_FindWordInContext,
  EX_SpellWhatYouHear,
  EX_MultipleChoiceL2toL1,
  EX_TranslateL2toL1,
  EX_TranslateWhatYouHear,
  EX_MultipleChoiceContext,
  EX_ClickWordInContext,
  EX_FindWordInContextCloze,
  EX_MultipleChoiceAudio,
];

export {
  DEFAULT_SEQUENCE,
  DEFAULT_SEQUENCE_NO_AUDIO,
  EXERCISE_TYPES_TIAGO,
  LEARNING_CYCLE_SEQUENCE,
  LEARNING_CYCLE_SEQUENCE_NO_AUDIO,
  DEFAULT_NUMBER_BOOKMARKS_TO_PRACTICE,
  MAX_NUMBER_OF_BOOKMARKS_EX_SESSION,
  ALL_EXERCISES,
};

// Function to validate that every combination of learningCycle and memoryTask has at
// least one exercise with requiredBookmarks = 1
function validateExerciseSequence(exerciseList) {
  const requiredTestedBookmarks = 1;

  function generateKey(learningCycle, memoryTask) {
    return `${learningCycle}_${memoryTask}`;
  }

  const exerciseMap = {};

  exerciseList.forEach((exercise) => {
    if (exercise.requiredBookmarks === requiredTestedBookmarks) {
      const key = generateKey(
        exercise.learningCycle || "",
        exercise.memoryTask || "",
      );
      exerciseMap[key] = true;
    }
  });

  const requiredCombinations = [
    "receptive_recognition",
    "receptive_recall",
    "productive_recognition",
    "productive_recall",
  ];

  requiredCombinations.forEach((combination) => {
    if (!exerciseMap[combination]) {
      throw new Error(
        `Missing required exercise for combination: ${combination}`,
      );
    }
  });
}

validateExerciseSequence(LEARNING_CYCLE_SEQUENCE);

validateExerciseSequence(LEARNING_CYCLE_SEQUENCE_NO_AUDIO);
