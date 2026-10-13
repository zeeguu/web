import { describe, it, expect } from "vitest";
import { sortCohorts } from "../../../../src/teacher/myClassesPage/cohortsPage/cohortSort";

const cohorts = [
  { id: 1, name: "Old French", last_activity: "2026-10-12T08:00:00Z" },
  { id: 2, name: "Dormant", last_activity: null },
  { id: 3, name: "Brand new", last_activity: null },
  { id: 4, name: "Active German", last_activity: "2026-10-13T08:00:00Z" },
];
const names = (list) => list.map((c) => c.name);

describe("sortCohorts", () => {
  it("puts recently active classes first, then the never-active, newest first", () => {
    expect(names(sortCohorts(cohorts, "active"))).toEqual(["Active German", "Old French", "Brand new", "Dormant"]);
  });

  it("orders by creation", () => {
    expect(names(sortCohorts(cohorts, "newest"))).toEqual(["Active German", "Brand new", "Dormant", "Old French"]);
  });

  it("orders by name", () => {
    expect(names(sortCohorts(cohorts, "name"))).toEqual(["Active German", "Brand new", "Dormant", "Old French"]);
  });

  it("falls back to recently active for an unknown sort, without touching the input", () => {
    const copy = [...cohorts];
    expect(names(sortCohorts(cohorts, "bogus"))[0]).toBe("Active German");
    expect(cohorts).toEqual(copy);
  });
});
