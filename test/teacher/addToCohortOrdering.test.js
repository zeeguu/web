import { byRelevance } from "../../src/teacher/myTextsPage/AddToCohortDialog";

const cohort = (name, last_shared_time = null) => ({
  id: name,
  name,
  last_shared_time,
});

const names = (cohorts) => cohorts.map((c) => c.name);

describe("byRelevance", () => {
  test("classes the text is already shared with come first", () => {
    const classes = [cohort("Dormant"), cohort("Already shared"), cohort("Recently used", "2026-08-01T10:00:00.000Z")];

    expect(names(byRelevance(classes, ["Already shared"]))).toEqual(["Already shared", "Recently used", "Dormant"]);
  });

  test("recently shared-with classes come before never-used ones, newest first", () => {
    const classes = [
      cohort("Never used"),
      cohort("Last year", "2025-09-01T10:00:00.000Z"),
      cohort("Last week", "2026-08-20T10:00:00.000Z"),
    ];

    expect(names(byRelevance(classes, []))).toEqual(["Last week", "Last year", "Never used"]);
  });

  test("never-used classes are alphabetical", () => {
    const classes = [cohort("Zebra"), cohort("Anteater"), cohort("Moose")];

    expect(names(byRelevance(classes, []))).toEqual(["Anteater", "Moose", "Zebra"]);
  });

  test("falls back to alphabetical against an API that does not send last_shared_time", () => {
    const classes = [
      { id: 2, name: "Beta" },
      { id: 1, name: "Alpha" },
    ];

    expect(names(byRelevance(classes, []))).toEqual(["Alpha", "Beta"]);
  });

  test("does not mutate the list it was given", () => {
    const classes = [cohort("Zebra"), cohort("Anteater")];
    byRelevance(classes, []);

    expect(names(classes)).toEqual(["Zebra", "Anteater"]);
  });
});
