import { EXERCISE_TYPES } from "./ExerciseTypeConstants";
import { withoutDisabledTypes } from "./disabledExerciseTypes";
import RecallWord from "./exerciseTypes/recallTest/RecallWord";
import RecallMeaning from "./exerciseTypes/recallTest/RecallMeaning";
import FlashcardWord from "./exerciseTypes/recallTest/FlashcardWord";
import FlashcardMeaning from "./exerciseTypes/recallTest/FlashcardMeaning";

export const RECALL_MEANING = {
  type: RecallMeaning,
  exerciseType: EXERCISE_TYPES.recallMeaning,
  requiredBookmarks: 1,
  testedBookmarks: 1,
  level: 2,
};
export const RECALL_WORD = {
  type: RecallWord,
  exerciseType: EXERCISE_TYPES.recallWord,
  requiredBookmarks: 1,
  testedBookmarks: 1,
  level: 4,
};
export const FLASHCARD_MEANING = {
  type: FlashcardMeaning,
  exerciseType: EXERCISE_TYPES.flashcardMeaning,
  requiredBookmarks: 1,
  testedBookmarks: 1,
  level: 2,
};
export const FLASHCARD_WORD = {
  type: FlashcardWord,
  exerciseType: EXERCISE_TYPES.flashcardWord,
  requiredBookmarks: 1,
  testedBookmarks: 1,
  level: 4,
};

export const FAMILY_MULTIPLE_CHOICE = "multiple_choice";
export const FAMILY_TYPING = "typing";
export const FAMILY_FLASHCARDS_MEANING = "flashcards_meaning";
export const FAMILY_FLASHCARDS_WORD = "flashcards_word";

export const ALL_FAMILY_KEYS = [
  FAMILY_MULTIPLE_CHOICE,
  FAMILY_TYPING,
  FAMILY_FLASHCARDS_MEANING,
  FAMILY_FLASHCARDS_WORD,
];

export const EXERCISE_FAMILY_TYPES = {
  [FAMILY_MULTIPLE_CHOICE]: [
    EXERCISE_TYPES.match,
    EXERCISE_TYPES.multipleChoiceL2toL1,
    EXERCISE_TYPES.clickWordInContext,
    EXERCISE_TYPES.multipleChoice,
    EXERCISE_TYPES.multipleChoiceContext,
    EXERCISE_TYPES.multipleChoiceAudio,
  ],
  [FAMILY_TYPING]: [
    EXERCISE_TYPES.translateL2toL1,
    EXERCISE_TYPES.findWordInContextCloze,
    EXERCISE_TYPES.translateWhatYouHear,
    EXERCISE_TYPES.spellWhatYouHear,
  ],
  [FAMILY_FLASHCARDS_MEANING]: [EXERCISE_TYPES.recallMeaning, EXERCISE_TYPES.flashcardMeaning],
  [FAMILY_FLASHCARDS_WORD]: [EXERCISE_TYPES.recallWord, EXERCISE_TYPES.flashcardWord],
};

// Parse comma-separated family names from user_preferences.
// Returns a Set of valid keys, or null when absent/empty/invalid.
export function parseExerciseFamilies(raw) {
  if (typeof raw !== "string") return null;
  const tokens = raw
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token !== "");
  if (tokens.length === 0) return null;
  if (tokens.some((token) => !ALL_FAMILY_KEYS.includes(token))) return null;
  return new Set(tokens);
}

export function serializeExerciseFamilies(familySet) {
  return ALL_FAMILY_KEYS.filter((key) => familySet.has(key)).join(",");
}

export function allowedContextualTypes(familySet) {
  const allowed = new Set();
  for (const key of [FAMILY_MULTIPLE_CHOICE, FAMILY_TYPING]) {
    if (familySet.has(key)) {
      for (const type of EXERCISE_FAMILY_TYPES[key]) allowed.add(type);
    }
  }
  return allowed;
}

export function selectExerciseSequence({
  baseSequence,
  disabledTypes = [],
  enabledFamilies = null,
  selfGradeFlashcards = false,
}) {
  const families = enabledFamilies && enabledFamilies.size > 0 ? enabledFamilies : new Set(ALL_FAMILY_KEYS);
  const allowedContextual = allowedContextualTypes(families);
  const contextualSequence = withoutDisabledTypes(
    baseSequence.filter((ex) => allowedContextual.has(ex.exerciseType)),
    disabledTypes,
  );

  const meaningCard = selfGradeFlashcards ? FLASHCARD_MEANING : RECALL_MEANING;
  const wordCard = selfGradeFlashcards ? FLASHCARD_WORD : RECALL_WORD;
  const enableMeaning = families.has(FAMILY_FLASHCARDS_MEANING) && !disabledTypes.includes(meaningCard.exerciseType);
  const enableWord = families.has(FAMILY_FLASHCARDS_WORD) && !disabledTypes.includes(wordCard.exerciseType);

  const enabledFlashcards = [
    ...(enableMeaning ? [meaningCard] : []),
    ...(enableWord ? [wordCard] : []),
  ];

  // Flashcards-only mode: every bookmark gets a flashcard across all 4 levels
  // (1-2 meaning, 3-4 word when both are enabled; or the single chosen side).
  if (contextualSequence.length === 0) {
    const sequence = enabledFlashcards.length > 0 ? enabledFlashcards : withoutDisabledTypes(baseSequence, disabledTypes);
    return {
      sequence,
      sprinkleOptions: { meaningCard, wordCard, enableMeaning: false, enableWord: false },
    };
  }

  // Contextual mode: if the learner disabled one contextual family (e.g. typing
  // at levels 3-4) while keeping the matching flashcard family on, let that
  // flashcard cover the missing levels; otherwise keep flashcards sprinkled.
  const coveredLevels = new Set(contextualSequence.map((ex) => ex.level));
  const gapFillers = enabledFlashcards.filter((card) => !coveredLevels.has(card.level));
  return {
    sequence: [...contextualSequence, ...gapFillers],
    sprinkleOptions: { meaningCard, wordCard, enableMeaning, enableWord },
  };
}
