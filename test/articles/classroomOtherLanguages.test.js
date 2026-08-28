import { otherLanguageOptions } from "../../src/articles/ClassroomOtherLanguages";

// The classroom feed keeps only cohort texts whose language matches the
// student's learned language (User.cohort_articles_for_user). These options are
// what the resulting empty screen offers instead of a dead end.
describe("otherLanguageOptions", () => {
  const englishClass = {
    id: 1,
    name: "CUT Language Centre",
    texts_by_language: [{ code: "en", name: "English", count: 5 }],
  };

  test("offers a class taught in another language", () => {
    expect(otherLanguageOptions([englishClass], "el")).toEqual([
      { key: "1-en", cohortName: "CUT Language Centre", languageCode: "en", count: 5 },
    ]);
  });

  test("offers nothing when the class already matches", () => {
    expect(otherLanguageOptions([englishClass], "en")).toEqual([]);
  });

  test("offers nothing when the class has no texts at all", () => {
    const emptyClass = { id: 2, name: "New class", texts_by_language: [] };
    expect(otherLanguageOptions([emptyClass], "el")).toEqual([]);
  });

  test("offers one row per class and language", () => {
    const mixedClass = {
      id: 3,
      name: "Mr. Olsen's B2",
      texts_by_language: [
        { code: "no", name: "Norwegian", count: 12 },
        { code: "el", name: "Greek", count: 2 },
      ],
    };

    const options = otherLanguageOptions([englishClass, mixedClass], "el");

    // The Greek texts are dropped: they are already reachable, so they are not
    // why the classroom is empty.
    expect(options.map((each) => each.key)).toEqual(["1-en", "3-no"]);
  });

  test("survives a student with no classes or an older API response", () => {
    expect(otherLanguageOptions(undefined, "el")).toEqual([]);
    expect(otherLanguageOptions([{ id: 4, name: "Old" }], "el")).toEqual([]);
  });
});
