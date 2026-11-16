import { describe, expect, it } from "vitest";
import { endsMidSentence, snippetParts } from "../../src/articles/snippetParts";

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

describe("endsMidSentence", () => {
  it("is true when the passage stops mid-sentence", () => {
    expect(endsMidSentence("Macron besøgte i går")).toBe(true);
  });

  it("is false after a sentence end", () => {
    expect(endsMidSentence("Macron besøgte København.")).toBe(false);
    expect(endsMidSentence("Han sagde: »Ja!«")).toBe(false);
    expect(endsMidSentence("Hvad nu?")).toBe(false);
  });
});
