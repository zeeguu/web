import {
  ALL,
  NOT_SHARED,
  buildClassFilters,
  filterTexts,
  classesOf,
} from "../../src/utils/misc/classFilters";

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

describe("classesOf", () => {
  test("is empty for a text shared with nobody", () => {
    expect(classesOf({})).toEqual([]);
  });

  // The names-only `cohorts` field cannot drive the x on a pill: it carries no
  // id, so an unshare would post a class name as cohort_id and 401.
  test("ignores the older names-only field", () => {
    expect(classesOf({ cohorts: ["nana"] })).toEqual([]);
  });
});

describe("cohort ids arriving from two endpoints", () => {
  // /teacher_texts sends shared_with with numeric ids; the share dialog builds
  // its objects from /cohorts_info. Those used to be stringified, so a text
  // shared in this session and the same text after a reload produced two
  // different chips for one class.
  test("a class shared just now and the same class after a reload are one chip", () => {
    const justShared = { id: 3, shared_with: [{ id: 7, name: "nana" }] };
    const afterReload = { id: 4, shared_with: [{ id: 7, name: "nana" }] };

    const filters = buildClassFilters([justShared, afterReload]);

    expect(filters.filter((each) => each.name === "nana")).toHaveLength(1);
    expect(filters.find((each) => each.name === "nana").count).toBe(2);
  });
});

describe("a student's classroom uses the same filters", () => {
  // The teacher's list says which classes a text was shared *with*; the
  // student's says which classes it reached them *through*. Same relationship.
  const fromClass = (id, name) => ({ id: 1, from_classes: [{ id, name }] });

  test("chips are built from from_classes too", () => {
    const filters = buildClassFilters([fromClass(82, "Danish Class"), fromClass(109, "Aiki")]);

    expect(filters.map((f) => f.name)).toEqual(["All", "Aiki", "Danish Class"]);
  });

  test("no Not-shared chip when every text has a class", () => {
    const filters = buildClassFilters([fromClass(82, "Danish Class")]);
    expect(filters.some((f) => f.id === NOT_SHARED)).toBe(false);
  });
});
