import { describe, it, expect } from "vitest";
import { sprinkleRecallTests } from "../../src/exercises/assignBookmarksToExercises";
import RecallWord from "../../src/exercises/exerciseTypes/recallTest/RecallWord";
import RecallMeaning from "../../src/exercises/exerciseTypes/recallTest/RecallMeaning";

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
