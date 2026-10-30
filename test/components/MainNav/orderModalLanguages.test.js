import { describe, it, expect } from "vitest";
import { orderModalLanguages } from "../../../src/components/MainNav/orderModalLanguages.js";

const langs = (...codes) => codes.map((code) => ({ code }));
const codes = (list) => list.map((l) => l.code);

describe("orderModalLanguages", () => {
  it("puts the current language first, then the most recently practised", () => {
    const ordered = orderModalLanguages(langs("de", "bg", "el", "da"), {
      learnedLanguage: "da",
      lastPracticedByCode: { de: "2026-09-01", bg: "2026-10-29", el: "2026-10-01", da: "2026-08-01" },
      streaksByCode: { de: 40 },
    });
    expect(codes(ordered)).toEqual(["da", "bg", "el", "de"]);
  });

  it("puts never-practised languages last", () => {
    const ordered = orderModalLanguages(langs("nl", "bg"), {
      learnedLanguage: "da",
      lastPracticedByCode: { bg: "2026-01-01" },
      streaksByCode: {},
    });
    expect(codes(ordered)).toEqual(["bg", "nl"]);
  });

  it("breaks a same-day tie by streak", () => {
    const ordered = orderModalLanguages(langs("fr", "it"), {
      learnedLanguage: "da",
      lastPracticedByCode: { fr: "2026-10-30", it: "2026-10-30" },
      streaksByCode: { fr: 2, it: 9 },
    });
    expect(codes(ordered)).toEqual(["it", "fr"]);
  });

  it("falls back to streak order when no dates are known", () => {
    const ordered = orderModalLanguages(langs("fr", "it"), {
      learnedLanguage: "da",
      lastPracticedByCode: {},
      streaksByCode: { fr: 2, it: 9 },
    });
    expect(codes(ordered)).toEqual(["it", "fr"]);
  });

  it("does not mutate its input", () => {
    const input = langs("fr", "da");
    orderModalLanguages(input, { learnedLanguage: "da", lastPracticedByCode: {}, streaksByCode: {} });
    expect(codes(input)).toEqual(["fr", "da"]);
  });
});
