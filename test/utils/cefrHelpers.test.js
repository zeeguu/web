import { effectiveCefrLevel } from "../../src/utils/misc/cefrHelpers";

// One difficulty, two screens: the teacher's texts list and the article editor
// must never disagree about the same article. The rule lives on the server
// (ArticleCefrAssessment.update_effective_cefr_level); these cover reading it,
// and the editor-only fallback that mirrors it for unsaved edits.
describe("effectiveCefrLevel", () => {
  const stored = {
    llm: { level: "B1" },
    ml: { level: "B2" },
    teacher: { level: null },
    effective_cefr_level: "B1/B2",
  };

  test("reads the level the server already computed", () => {
    expect(effectiveCefrLevel(stored)).toBe("B1/B2");
  });

  test("an unsaved rewrite wins over the stored level", () => {
    expect(effectiveCefrLevel(stored, "C1")).toBe("C1");
  });

  test("is null when nothing has assessed the article", () => {
    expect(effectiveCefrLevel(undefined)).toBeNull();
    expect(effectiveCefrLevel({})).toBeNull();
  });

  // The editor holds the estimators in state and re-runs them as the text is
  // edited, so it passes no stored value.
  describe("editor fallback, with no stored level", () => {
    const live = (llm, ml, teacher = null) => ({
      llm: { level: llm },
      ml: { level: ml },
      teacher: { level: teacher },
    });

    test("agreement gives that level", () => {
      expect(effectiveCefrLevel(live("B1", "B1"))).toBe("B1");
    });

    test("adjacent disagreement gives a compound level, like the server", () => {
      expect(effectiveCefrLevel(live("B1", "B2"))).toBe("B1/B2");
      expect(effectiveCefrLevel(live("B2", "B1"))).toBe("B1/B2");
    });

    test("a wider gap resolves to the harder level, conservatively", () => {
      expect(effectiveCefrLevel(live("A2", "C1"))).toBe("C1");
    });

    test("a teacher's own level beats the estimators", () => {
      expect(effectiveCefrLevel(live("B1", "B2", "A2"))).toBe("A2");
    });

    test("copes with only one estimator having run", () => {
      expect(effectiveCefrLevel(live("B1", null))).toBe("B1");
      expect(effectiveCefrLevel(live(null, "B1"))).toBe("B1");
      expect(effectiveCefrLevel(live(null, null))).toBeNull();
    });
  });
});
