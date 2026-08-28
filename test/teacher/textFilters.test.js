import {
  ALL,
  NOT_SHARED,
  buildClassFilters,
  filterTexts,
  sharedClassesOf,
} from "../../src/teacher/myTextsPage/textFilters";

const text = (id, ...classes) => ({ id, shared_with: classes });
const CUT = { id: 1, name: "CUT Language Centre" };
const ROMANA = { id: 2, name: "texte in romana" };

describe("buildClassFilters", () => {
  test("one chip per class actually used, counted from the texts", () => {
    const filters = buildClassFilters([text(1, CUT), text(2, CUT, ROMANA), text(3)]);

    expect(filters.map((f) => [f.name, f.count])).toEqual([
      ["All", 3],
      ["CUT Language Centre", 2],
      ["texte in romana", 1],
      ["Not shared", 1],
    ]);
  });

  test("hides Not shared when every text has a class", () => {
    const filters = buildClassFilters([text(1, CUT)]);
    expect(filters.map((f) => f.name)).toEqual(["All", "CUT Language Centre"]);
  });

  test("classes are listed by name, not by order of appearance", () => {
    const filters = buildClassFilters([text(1, ROMANA), text(2, CUT)]);
    expect(filters.slice(1).map((f) => f.name)).toEqual([
      "CUT Language Centre",
      "texte in romana",
    ]);
  });
});

describe("filterTexts", () => {
  const texts = [text(1, CUT), text(2, ROMANA), text(3)];

  test("All keeps everything", () => {
    expect(filterTexts(texts, ALL)).toHaveLength(3);
  });

  test("a class keeps only its texts", () => {
    expect(filterTexts(texts, CUT.id).map((t) => t.id)).toEqual([1]);
  });

  test("Not shared keeps the texts with no class", () => {
    expect(filterTexts(texts, NOT_SHARED).map((t) => t.id)).toEqual([3]);
  });

  test("filters by id, so two classes sharing a name stay distinct", () => {
    const other = { id: 9, name: "CUT Language Centre" };
    expect(filterTexts([text(1, CUT), text(2, other)], other.id).map((t) => t.id)).toEqual([2]);
  });
});

describe("sharedClassesOf", () => {
  // The API deploys before the web, but not the other way round: a client can
  // meet a response that only has the older names-only `cohorts` field.
  test("falls back to the names-only field", () => {
    expect(sharedClassesOf({ cohorts: ["nana"] })).toEqual([{ id: "nana", name: "nana" }]);
  });

  test("is empty for a text shared with nobody", () => {
    expect(sharedClassesOf({})).toEqual([]);
  });
});
