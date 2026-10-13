import { describe, it, expect } from "vitest";
import { sortStudents, matchesSearch } from "../../../../src/teacher/myClassesPage/cohortsPage/studentSort";

const students = [
  { id: 1, name: "Cleo", email: "c@school.nl", total_time: 300 },
  { id: 2, name: "Anna", email: "a@school.nl", total_time: 0 },
  { id: 3, name: "Bram", email: "b@school.nl", total_time: 1200 },
  { id: 4, name: "Dirk", email: "d@school.nl", total_time: 0 },
];
const names = (list) => list.map((s) => s.name);

describe("sortStudents", () => {
  it("orders by name by default", () => {
    expect(names(sortStudents(students, "name"))).toEqual(["Anna", "Bram", "Cleo", "Dirk"]);
    expect(names(sortStudents(students, "bogus"))).toEqual(["Anna", "Bram", "Cleo", "Dirk"]);
  });

  it("puts the longest inactive first, never-active at the top", () => {
    const withActivity = [
      { name: "Anna", total_time: 0, last_active: null },
      { name: "Bram", total_time: 1200, last_active: "2026-10-12T10:00:00Z" },
      { name: "Cleo", total_time: 300, last_active: "2026-09-01T10:00:00Z" },
    ];
    expect(names(sortStudents(withActivity, "needs_attention"))).toEqual(["Anna", "Cleo", "Bram"]);
  });

  it("puts the busiest first", () => {
    expect(names(sortStudents(students, "most_active"))).toEqual(["Bram", "Cleo", "Anna", "Dirk"]);
  });
});

describe("matchesSearch", () => {
  it("finds by name or email, ignoring case", () => {
    expect(matchesSearch(students[0], "cle")).toBe(true);
    expect(matchesSearch(students[0], "C@SCHOOL")).toBe(true);
    expect(matchesSearch(students[0], "bram")).toBe(false);
    expect(matchesSearch(students[0], "  ")).toBe(true);
  });
});
