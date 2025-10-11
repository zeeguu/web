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

  isMultiBookmarkExercise: function (exerciseType) {
    return [this.multipleChoice, this.multipleChoiceContext, this.match].includes(exerciseType);
  },
  isAudioExercise: function (exerciseType) {
    return [this.multipleChoiceAudio, this.spellWhatYouHear, this.translateWhatYouHear].includes(exerciseType);
  },
};

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
