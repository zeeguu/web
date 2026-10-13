import { describe, it, expect } from "vitest";
import { sortStudents, matchesSearch, nextSort } from "../../../../src/teacher/myClassesPage/cohortsPage/studentSort";

const students = [
  {
    id: 1,
    name: "Cleo",
    email: "c@school.nl",
    total_time: 300,
    last_active: "2026-09-01T10:00:00Z",
    number_of_exercises: 12,
    correct_on_1st_try: 0.9,
  },
  { id: 2, name: "Anna", email: "a@school.nl", total_time: 0, last_active: null, number_of_exercises: 0 },
  {
    id: 3,
    name: "Bram",
    email: "b@school.nl",
    total_time: 1200,
    last_active: "2026-10-12T10:00:00Z",
    number_of_exercises: 30,
    correct_on_1st_try: 0.5,
  },
  {
    id: 4,
    name: "Dirk",
    email: "d@school.nl",
    total_time: 0,
    last_active: null,
    number_of_exercises: 3,
    correct_on_1st_try: 1,
  },
];
const names = (list) => list.map((s) => s.name);

describe("sortStudents", () => {
  it("orders by name by default, and for anything unknown", () => {
    expect(names(sortStudents(students))).toEqual(["Anna", "Bram", "Cleo", "Dirk"]);
    expect(names(sortStudents(students, "least_active"))).toEqual(["Anna", "Bram", "Cleo", "Dirk"]);
  });

  it("puts the longest inactive first (never active on top)", () => {
    expect(names(sortStudents(students, { key: "last_active", dir: "desc" }))).toEqual([
      "Anna",
      "Dirk",
      "Cleo",
      "Bram",
    ]);
  });

  it("sorts by time, both ways", () => {
    expect(names(sortStudents(students, { key: "time", dir: "desc" }))).toEqual(["Bram", "Cleo", "Anna", "Dirk"]);
    expect(names(sortStudents(students, { key: "time", dir: "asc" }))).toEqual(["Anna", "Dirk", "Cleo", "Bram"]);
  });

  it("keeps students with too few exercises at the bottom of Correct", () => {
    expect(names(sortStudents(students, { key: "correct", dir: "desc" }))).toEqual(["Cleo", "Bram", "Anna", "Dirk"]);
    expect(names(sortStudents(students, { key: "correct", dir: "asc" }))).toEqual(["Bram", "Cleo", "Anna", "Dirk"]);
  });
});

describe("nextSort", () => {
  it("starts a column its usual way and reverses on a second click", () => {
    expect(nextSort({ key: "name", dir: "asc" }, "last_active")).toEqual({ key: "last_active", dir: "desc" });
    expect(nextSort({ key: "last_active", dir: "desc" }, "last_active")).toEqual({ key: "last_active", dir: "asc" });
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
