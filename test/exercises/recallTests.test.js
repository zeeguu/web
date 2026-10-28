import { describe, it, expect } from "vitest";
import { sprinkleRecallTests } from "../../src/exercises/assignBookmarksToExercises";
import RecallWord from "../../src/exercises/exerciseTypes/recallWord/RecallWord";

// Now and then a word is tested on its own: translation only, no context, no hint.
const Other = () => null;
const word = (id, level) => ({ id, from: `w${id}`, to: `t${id}`, level });
const single = (bookmark) => ({ type: Other, bookmarks: [bookmark] });

describe("Recall tests", () => {
  it("replace an exercise on one practised word when the dice say so", () => {
    const [exercise] = sprinkleRecallTests([single(word(1, 3))], () => 0);
    expect(exercise.type).toBe(RecallWord);
    expect(exercise.bookmarks.map((b) => b.id)).toEqual([1]);
  });

  it("stay rare", () => {
    expect(sprinkleRecallTests([single(word(1, 3))], () => 0.5)[0].type).toBe(Other);
  });

  it("leave words at level 1 alone: they have not been practised yet", () => {
    expect(sprinkleRecallTests([single(word(1, 1))], () => 0)[0].type).toBe(Other);
  });

  it("never replace an exercise that uses other words too", () => {
    const match = { type: Other, bookmarks: [word(1, 3), word(2, 3), word(3, 3)] };
    expect(sprinkleRecallTests([match], () => 0)[0]).toBe(match);
  });
});
