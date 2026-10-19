import { describe, it, expect } from "vitest";
import { assignBookmarksToA0Exercises } from "../../src/exercises/assignBookmarksToExercises";
import ListenChooseMeaning from "../../src/exercises/exerciseTypes/listenChooseMeaning/ListenChooseMeaning";

// A0 learners know their words only by ear: every word gets "listen and choose
// what it means", never an exercise where they read or type the word.
// Each word its own spoken form: the same spoken word is never a wrong option.
const word = (id, to, context = "En kaffe, tak.") => ({ id, from: `w${id}`, to, context, level: 1 });

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

describe("A0 exercise meanings", () => {
  it("treat meanings that differ only in punctuation or case as one", () => {
    const words = [word(1, "coffee"), word(2, "Coffee."), word(3, "thanks"), word(4, "hello")];
    for (const exercise of assignBookmarksToA0Exercises(words)) {
      const shown = exercise.bookmarks.map((b) => b.to.replace(/[.]/g, "").toLowerCase());
      expect(new Set(shown).size).toBe(3);
    }
  });
});

describe("A0 exercise wrong options", () => {
  it("are never another meaning of the same word", () => {
    const words = [
      { id: 1, from: "tak", to: "thanks", context: "Tak." },
      { id: 2, from: "tak", to: "thank you", context: "Tak skal du have." },
      { id: 3, from: "kaffe", to: "coffee", context: "En kaffe." },
      { id: 4, from: "hej", to: "hello", context: "Hej!" },
    ];
    for (const exercise of assignBookmarksToA0Exercises(words)) {
      const [asked, ...wrong] = exercise.bookmarks;
      for (const option of wrong) expect(option.from).not.toBe(asked.from);
    }
  });
});
