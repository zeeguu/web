import { describe, it, expect } from "vitest";

import { fetchDisabledExerciseTypes, withoutDisabledTypes } from "../../src/exercises/disabledExerciseTypes";
import { EXTENDED_SEQUENCE, EXTENDED_SEQUENCE_NO_AUDIO } from "../../src/exercises/exerciseSequenceTypes";
import { EXERCISE_TYPES } from "../../src/exercises/ExerciseTypeConstants";
import { sprinkleRecallTests } from "../../src/exercises/assignBookmarksToExercises";

const typesIn = (sequence) => sequence.map((exercise) => exercise.exerciseType);

describe("withoutDisabledTypes", () => {
  it("every exercise in the sequences can be named from the API", () => {
    expect(typesIn(EXTENDED_SEQUENCE).every(Boolean)).toBe(true);
    expect(typesIn(EXTENDED_SEQUENCE_NO_AUDIO).every(Boolean)).toBe(true);
  });

  it("leaves the sequence alone when nothing is disabled", () => {
    expect(withoutDisabledTypes(EXTENDED_SEQUENCE, [])).toEqual(EXTENDED_SEQUENCE);
  });

  it("removes a disabled type, in both sequences", () => {
    for (const sequence of [EXTENDED_SEQUENCE, EXTENDED_SEQUENCE_NO_AUDIO]) {
      expect(typesIn(withoutDisabledTypes(sequence, [EXERCISE_TYPES.match]))).not.toContain(EXERCISE_TYPES.match);
    }
  });

  it("keeps the last single-word type of a level", () => {
    // Without audio, level 3 has nothing else.
    const types = typesIn(withoutDisabledTypes(EXTENDED_SEQUENCE_NO_AUDIO, [EXERCISE_TYPES.translateL2toL1]));
    expect(types).toContain(EXERCISE_TYPES.translateL2toL1);
  });

  it("keeps one level's last type even when both are disabled", () => {
    const both = [EXERCISE_TYPES.translateL2toL1, EXERCISE_TYPES.translateWhatYouHear];
    const levelThree = withoutDisabledTypes(EXTENDED_SEQUENCE, both).filter((exercise) => exercise.level === 3);
    expect(levelThree.length).toBeGreaterThan(0);
  });

  it("ignores names it does not know", () => {
    expect(withoutDisabledTypes(EXTENDED_SEQUENCE, ["Nonsense"])).toEqual(EXTENDED_SEQUENCE);
  });
});

describe("fetchDisabledExerciseTypes", () => {
  it("returns what the API says", async () => {
    const api = { getDisabledExerciseTypes: (callback) => callback(["Match"]) };
    expect(await fetchDisabledExerciseTypes(api)).toEqual(["Match"]);
  });

  it("disables nothing when the request fails", async () => {
    const api = { getDisabledExerciseTypes: (_callback, onError) => onError(new Error("HTTP 404")) };
    expect(await fetchDisabledExerciseTypes(api)).toEqual([]);
  });

  it("disables nothing when the API does not answer in time", async () => {
    const api = { getDisabledExerciseTypes: () => {} };
    expect(await fetchDisabledExerciseTypes(api, 5)).toEqual([]);
  });

  it("disables nothing when the answer is not a list", async () => {
    const api = { getDisabledExerciseTypes: (callback) => callback({ error: "nope" }) };
    expect(await fetchDisabledExerciseTypes(api)).toEqual([]);
  });
});

describe("sprinkleRecallTests", () => {
  const exercise = { type: "Original", bookmarks: [{ level: 2 }] };
  const always = () => 0;

  it("does not swap in a disabled recall test", () => {
    const [result] = sprinkleRecallTests([exercise], always, [EXERCISE_TYPES.recallMeaning]);
    expect(result.type).toBe("Original");
  });
});
