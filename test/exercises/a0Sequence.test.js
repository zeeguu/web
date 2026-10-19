import { describe, it, expect } from "vitest";
import { A0_SEQUENCE } from "../../src/exercises/exerciseSequenceTypes";
import { assignBookmarksToExercises } from "../../src/exercises/assignBookmarksToExercises";
import MultipleChoiceAudio from "../../src/exercises/exerciseTypes/multipleChoiceAudio/MultipleChoiceAudio";
import ClickWordInContext from "../../src/exercises/exerciseTypes/wordInContextExercises/ClickWordInContext";

// A0 learners know their words only by ear: every exercise is one where they
// listen or tap, never one where they type.
const bookmark = (id, level, context) => ({ id, level, context, to: `t${id}` });

describe("A0 exercise sequence", () => {
  it("has a listening exercise and a one-word fallback at every level", () => {
    for (const level of [1, 2, 3, 4]) {
      const atLevel = A0_SEQUENCE.filter((e) => e.level === level);
      expect(atLevel.map((e) => e.type)).toEqual([MultipleChoiceAudio, ClickWordInContext]);
      expect(atLevel.some((e) => e.requiredBookmarks === 1)).toBe(true);
    }
  });

  it("gives every word an exercise, with no typing", () => {
    const words = [
      bookmark(1, 1, "Hej! Hvad vil du have?"),
      bookmark(2, 1, "En kaffe, tak."),
      bookmark(3, 1, "Værsgo."),
      bookmark(4, 3, "Tak skal du have."),
    ];
    const session = assignBookmarksToExercises([...words], A0_SEQUENCE);
    const exercised = new Set(session.flatMap((e) => e.bookmarks.map((b) => b.id)));
    expect(exercised).toEqual(new Set([1, 2, 3, 4]));
    for (const e of session) expect([MultipleChoiceAudio, ClickWordInContext]).toContain(e.type);
  });
});
