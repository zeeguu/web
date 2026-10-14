import { describe, it, expect } from "vitest";
import { classifyTypedAnswer, EXACT, MISSPELLING, OTHER_WORD, EMPTY } from "../../../src/exercises/utils/typedAnswer";

describe("classifyTypedAnswer", () => {
  it("recognises the expected word regardless of case and spacing", () => {
    expect(classifyTypedAnswer("  Synes ", "synes")).toBe(EXACT);
  });

  it("treats a near spelling of the expected word as a misspelling", () => {
    expect(classifyTypedAnswer("spænende", "spændende")).toBe(MISSPELLING);
  });

  it("treats a different word as worth asking about", () => {
    expect(classifyTypedAnswer("tænker", "synes")).toBe(OTHER_WORD);
    expect(classifyTypedAnswer("et stykke", "en del")).toBe(OTHER_WORD);
  });

  it("treats an empty answer as empty", () => {
    expect(classifyTypedAnswer("   ", "synes")).toBe(EMPTY);
  });
});

describe("classifyTypedAnswer on short words", () => {
  it("allows one slip even in a short word, but not two", () => {
    expect(classifyTypedAnswer("synse", "synes")).toBe(OTHER_WORD); // two edits
    expect(classifyTypedAnswer("synnes", "synes")).toBe(MISSPELLING);
  });
});
