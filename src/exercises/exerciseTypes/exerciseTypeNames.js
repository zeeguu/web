// Mapping from exercise type constants to component names
const exerciseNames = {
  "Cloze_L1_to_L2": "FindWordInContextCloze",
  "Match_three_L1W_to_three_L2W": "Match",
  "Select_L2T_fitting_L2W": "MultipleChoiceContext",
  "Select_L2W_fitting_L2T": "MultipleChoice",
  "Multiple_Choice_Audio": "MultipleChoiceAudio",
  "Select_L1W_fitting_L2T": "MultipleChoiceL2toL1",
  "Spell_What_You_Hear": "SpellWhatYouHear",
  "Translate_L2_to_L1": "TranslateL2toL1",
  "Translate_What_You_Hear": "TranslateWhatYouHear",
  "Click_L1W_in_L2T": "ClickWordInContext",
  "Recognize_L1W_in_L2T": "FindWordInContext",
};

// Utility function to convert exercise type constants to file names
export function getExerciseTypeName(exerciseType) {
  return exerciseNames[exerciseType] || exerciseType;
}

// Reverse mapping: component name to exercise type constant
export function getExerciseTypeConstant(componentName) {
  const reverseMapping = Object.fromEntries(
    Object.entries(exerciseNames).map(([constant, name]) => [name, constant])
  );
  return reverseMapping[componentName] || componentName;
}