export const EXERCISE_TYPES = {
  findWordInContextCloze: "Cloze_L1_to_L2",
  match: "Match_three_L1W_to_three_L2W",
  multipleChoiceContext: "Select_L2T_fitting_L2W",
  multipleChoice: "Select_L2W_fitting_L2T",
  multipleChoiceAudio: "Multiple_Choice_Audio",
  multipleChoiceL2toL1: "Select_L1W_fitting_L2T",
  spellWhatYouHear: "Spell_What_You_Hear",
  translateL2toL1: "Translate_L2_to_L1",
  translateWhatYouHear: "Translate_What_You_Hear",
  clickWordInContext: "Click_L1W_in_L2T",
  findWordInContext: "Recognize_L1W_in_L2T",
  listenChooseMeaning: "Listen_L2W_choose_L1W",
  recallWord: "Recall_L2W_from_L1W_no_hints",
  recallMeaning: "Recall_L1W_from_L2W_no_hints",
  flashcardWord: "Flashcard_L2W_from_L1W",
  flashcardMeaning: "Flashcard_L1W_from_L2W",

  isMultiBookmarkExercise: function (exerciseType) {
    return [this.multipleChoice, this.multipleChoiceContext, this.match].includes(exerciseType);
  },
  isAudioExercise: function (exerciseType) {
    // Not listenChooseMeaning: see why in its component.
    return [this.multipleChoiceAudio, this.spellWhatYouHear, this.translateWhatYouHear].includes(exerciseType);
  },
};

// The exercises where the learner produces the word in the language they learn
// (the level-4 types). For a learner who practices production, only an answer
// in one of these can mark a word learned. The api keeps the same list
// (ExerciseSource.PRODUCTION); test/exercises/productionExerciseTypes.test.js
// fails if the two drift apart.
export const PRODUCTION_EXERCISE_TYPES = Object.freeze([
  EXERCISE_TYPES.findWordInContextCloze,
  EXERCISE_TYPES.spellWhatYouHear,
  EXERCISE_TYPES.recallWord,
  EXERCISE_TYPES.flashcardWord,
]);

// Whether an answer in this exercise can mark the word learned. The api sets
// learning_needs_production on a word that only a production answer can learn.
export function canLearnWithThisExercise(bookmark, exerciseType) {
  if (!bookmark?.learning_needs_production) return true;
  return PRODUCTION_EXERCISE_TYPES.includes(exerciseType);
}

export const MEMORY_TASK = Object.freeze({
  RECALL: "recall",
  RECOGNITION: "recognition",
});

export const PRONOUNCIATION_SETTING = Object.freeze({
  off: 0,
  on: 1,
});

export const PRONOUNCIATION_SETTING_NAME = Object.freeze({
  0: "Off",
  1: "On",
});
