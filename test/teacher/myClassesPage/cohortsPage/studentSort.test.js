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

  it("puts the students who did nothing first, by name among them", () => {
    expect(names(sortStudents(students, "least_active"))).toEqual(["Anna", "Dirk", "Cleo", "Bram"]);
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
