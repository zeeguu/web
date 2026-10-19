import { describe, it, expect } from "vitest";
import { assignBookmarksToA0Exercises } from "../../src/exercises/assignBookmarksToExercises";
import ListenChooseMeaning from "../../src/exercises/exerciseTypes/listenChooseMeaning/ListenChooseMeaning";

// A0 learners know their words only by ear: every word gets "listen and choose
// what it means", never an exercise where they read or type the word.
const word = (id, to, context = "En kaffe, tak.") => ({ id, to, context, level: 1 });

describe("A0 exercises", () => {
  it("give every word a listening exercise, even when they share a dialogue line", () => {
    const words = [word(1, "coffee"), word(2, "thanks"), word(3, "a"), word(4, "hello", "Hej!")];
    const session = assignBookmarksToA0Exercises(words);
    expect(session.map((e) => e.bookmarks[0].id)).toEqual([1, 2, 3, 4]);
    for (const exercise of session) {
      expect(exercise.type).toBe(ListenChooseMeaning);
      expect(new Set(exercise.bookmarks.map((b) => b.to)).size).toBe(3);
    }
  });

  it("wait when there are not two other meanings to choose among", () => {
    expect(assignBookmarksToA0Exercises([word(1, "coffee"), word(2, "thanks")])).toEqual([]);
    // Two words, one meaning: still only two different meanings in the session.
    expect(assignBookmarksToA0Exercises([word(1, "coffee"), word(2, "coffee"), word(3, "thanks")])).toEqual([]);
  });
});
