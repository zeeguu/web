import { describe, expect, it } from "vitest";
import { endsMidSentence, snippetParts, startNearFirstMatch } from "../../src/articles/snippetParts";

describe("snippetParts", () => {
  it("splits the passage around the marked words", () => {
    expect(snippetParts("Præsident <mark>Macron</mark> besøgte København.")).toEqual([
      { text: "Præsident ", marked: false },
      { text: "Macron", marked: true },
      { text: " besøgte København.", marked: false },
    ]);
  });

  it("handles a mark at either end and several marks", () => {
    expect(snippetParts("<mark>Macron</mark> og <mark>Macron</mark>")).toEqual([
      { text: "Macron", marked: true },
      { text: " og ", marked: false },
      { text: "Macron", marked: true },
    ]);
  });

  it("keeps other angle brackets in the text as text", () => {
    expect(snippetParts("a <b> c <mark>x</mark>")).toEqual([
      { text: "a <b> c ", marked: false },
      { text: "x", marked: true },
    ]);
  });

  it("returns nothing for no passage", () => {
    expect(snippetParts(undefined)).toEqual([]);
    expect(snippetParts("")).toEqual([]);
  });
});

describe("startNearFirstMatch", () => {
  const late = snippetParts(
    "Efter et langt møde i Bruxelles om landbrugsstøtten og fiskekvoterne sagde <mark>Macron</mark> nej.",
  );

  it("starts shortly before a late match, at a word, with an ellipsis", () => {
    const [first, match] = startNearFirstMatch(late);
    expect(first.text).toBe("…og fiskekvoterne sagde ");
    expect(match).toEqual({ text: "Macron", marked: true });
  });

  it("leaves an early match alone", () => {
    const early = snippetParts("Præsident <mark>Macron</mark> besøgte København.");
    expect(startNearFirstMatch(early)).toEqual(early);
  });
});

describe("endsMidSentence", () => {
  it("is true when the passage stops mid-sentence", () => {
    expect(endsMidSentence("Macron besøgte i går")).toBe(true);
  });

  it("is false after a sentence end, also inside closing quotes", () => {
    expect(endsMidSentence("Macron besøgte København.")).toBe(false);
    expect(endsMidSentence("Hvad nu?")).toBe(false);
    expect(endsMidSentence("Han sagde: »Ja!«")).toBe(false);
    expect(endsMidSentence("Er sagte: „Das ist gut.“")).toBe(false);
    expect(endsMidSentence("He said ‘yes.’")).toBe(false);
  });
});
