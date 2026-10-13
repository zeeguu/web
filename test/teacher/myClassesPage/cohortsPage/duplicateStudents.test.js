import { describe, it, expect } from "vitest";
import { likelyDuplicates, classListOrder } from "../../../../src/teacher/myClassesPage/cohortsPage/duplicateStudents";

describe("likelyDuplicates", () => {
  it("pairs a student number at two domains, and the same name", () => {
    const students = [
      { id: 1, name: "Anna de Vries", email: "123456@zaam.nl" },
      { id: 2, name: "anna  de vries ", email: "123456@leerling.cygnusgymnasium.nl" },
      { id: 3, name: "Bram", email: "bram@school.nl" },
      { id: 4, name: "Bram", email: "b.jansen@school.nl" },
      { id: 5, name: "Chris", email: "chris@school.nl" },
    ];
    const dups = likelyDuplicates(students);
    expect(dups[1].map((s) => s.id)).toEqual([2]);
    expect(dups[2].map((s) => s.id)).toEqual([1]);
    expect(dups[3].map((s) => s.id)).toEqual([4]);
    expect(dups[5]).toBeUndefined();
  });

  it("does not pair students with no name or email", () => {
    expect(likelyDuplicates([{ id: 1 }, { id: 2 }])).toEqual({});
  });
});

describe("classListOrder", () => {
  it("sorts by name and puts likely duplicates side by side", () => {
    const students = [
      { id: 1, name: "Emmanuel Spiertz", email: "emmanuel.spiertz@gmail.com" },
      { id: 2, name: "Evi Smits", email: "9491@rml.nl" },
      { id: 3, name: "Emmanuel Spiertz", email: "9566@rml.nl" },
      { id: 4, name: "Zoë", email: "7777@rml.nl" },
      { id: 5, name: "Anna", email: "zoe@gmail.com" },
      { id: 6, name: "Bert", email: "7777@school.nl" },
    ];
    expect(classListOrder(students).map((s) => s.id)).toEqual([5, 6, 4, 1, 3, 2]);
  });
});
