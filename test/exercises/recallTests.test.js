import { describe, it, expect } from "vitest";
import { sprinkleRecallTests, buildExerciseSession } from "../../src/exercises/assignBookmarksToExercises";
import { EXTENDED_SEQUENCE_NO_AUDIO } from "../../src/exercises/exerciseSequenceTypes";
import RecallWord from "../../src/exercises/exerciseTypes/recallTest/RecallWord";
import RecallMeaning from "../../src/exercises/exerciseTypes/recallTest/RecallMeaning";
import FlashcardWord from "../../src/exercises/exerciseTypes/recallTest/FlashcardWord";
import FlashcardMeaning from "../../src/exercises/exerciseTypes/recallTest/FlashcardMeaning";
import {
  FAMILY_FLASHCARDS_MEANING,
  FAMILY_FLASHCARDS_WORD,
  FAMILY_MULTIPLE_CHOICE,
  FAMILY_TYPING,
} from "../../src/exercises/exerciseFamilies";

// Now and then a word is tested on its own: one side of it, no context, no hint.
const Other = () => null;
const word = (id, level) => ({ id, from: `w${id}`, to: `t${id}`, level });
const single = (bookmark) => ({ type: Other, bookmarks: [bookmark] });
const testFor = (level, dice = 0) => sprinkleRecallTests([single(word(1, level))], () => dice)[0];

describe("Recall tests", () => {
  it("ask for the meaning at levels 2 and 3, and for the word at level 4", () => {
    expect(testFor(2).type).toBe(RecallMeaning);
    expect(testFor(3).type).toBe(RecallMeaning);
    expect(testFor(4).type).toBe(RecallWord);
    expect(testFor(4).bookmarks.map((b) => b.id)).toEqual([1]);
  });

  it("stay rare", () => {
    expect(testFor(4, 0.5).type).toBe(Other);
  });

  it("leave words at level 1 alone: they have not been practised yet", () => {
    expect(testFor(1).type).toBe(Other);
  });

  it("never replace an exercise that uses other words too", () => {
    const match = { type: Other, bookmarks: [word(1, 4), word(2, 4), word(3, 4)] };
    expect(sprinkleRecallTests([match], () => 0)[0]).toBe(match);
  });
});

describe("buildExerciseSession with exercise families", () => {
  const bookmarks = [1, 2, 3, 4].map((level) => ({
    id: level,
    from: `word${level}`,
    to: `meaning${level}`,
    context: `Sentence ${level}.`,
    level,
  }));

  it("runs a single flashcard family across all four levels", () => {
    const session = buildExerciseSession(bookmarks, {
      baseSequence: EXTENDED_SEQUENCE_NO_AUDIO,
      enabledFamilies: new Set([FAMILY_FLASHCARDS_MEANING]),
      selfGradeFlashcards: true,
    });
    expect(session.map((e) => e.type)).toEqual([
      FlashcardMeaning,
      FlashcardMeaning,
      FlashcardMeaning,
      FlashcardMeaning,
    ]);
  });

  it("splits meaning (levels 1-2) and word (levels 3-4) when both flashcard families are on", () => {
    const session = buildExerciseSession(bookmarks, {
      baseSequence: EXTENDED_SEQUENCE_NO_AUDIO,
      enabledFamilies: new Set([FAMILY_FLASHCARDS_MEANING, FAMILY_FLASHCARDS_WORD]),
      selfGradeFlashcards: false,
    });
    expect(session.map((e) => e.type)).toEqual([RecallMeaning, RecallMeaning, RecallWord, RecallWord]);
  });

  it("falls back across levels when only multiple choice or only typing is enabled", () => {
    const mcOnly = buildExerciseSession(bookmarks, {
      baseSequence: EXTENDED_SEQUENCE_NO_AUDIO,
      enabledFamilies: new Set([FAMILY_MULTIPLE_CHOICE]),
      random: () => 0,
    });
    expect(mcOnly).toHaveLength(4);
    expect(mcOnly.every((e) => ![RecallMeaning, RecallWord, FlashcardMeaning, FlashcardWord].includes(e.type))).toBe(true);

    const typingOnly = buildExerciseSession(bookmarks, {
      baseSequence: EXTENDED_SEQUENCE_NO_AUDIO,
      enabledFamilies: new Set([FAMILY_TYPING]),
      random: () => 0,
    });
    expect(typingOnly).toHaveLength(4);
    expect(typingOnly.every((e) => ![RecallMeaning, RecallWord, FlashcardMeaning, FlashcardWord].includes(e.type))).toBe(true);
  });

  it("uses tap-to-flip flashcards for sprinkled recall tests when self-grade is on", () => {
    const session = buildExerciseSession(bookmarks, {
      baseSequence: EXTENDED_SEQUENCE_NO_AUDIO,
      enabledFamilies: new Set([
        FAMILY_MULTIPLE_CHOICE,
        FAMILY_TYPING,
        FAMILY_FLASHCARDS_MEANING,
        FAMILY_FLASHCARDS_WORD,
      ]),
      selfGradeFlashcards: true,
      random: () => 0,
    });
    expect(session.map((e) => e.type)).toContain(FlashcardMeaning);
    expect(session.map((e) => e.type)).toContain(FlashcardWord);
  });
});
