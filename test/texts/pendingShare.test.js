import { describe, it, expect } from "vitest";
import { parsePendingShare, destinationOf } from "../../src/texts/pendingShare";

describe("pending share", () => {
  it("reads what the native side stored", () => {
    expect(parsePendingShare('{"text":"Hej alle!"}')).toEqual({ text: "Hej alle!" });
  });

  it("ignores a missing or unreadable value", () => {
    expect(parsePendingShare(null)).toBe(null);
    expect(parsePendingShare("not json")).toBe(null);
    expect(parsePendingShare('"just a string"')).toBe(null);
  });

  it("sends a message to the short texts", () => {
    const text = "Hej alle! Træningen i morgen er aflyst, fordi banen er lukket.";
    expect(destinationOf({ text })).toEqual({ text });
  });

  it("opens a shared link as an article, its own query intact", () => {
    expect(destinationOf({ url: "https://example.com/a?b=1&c=2" })).toEqual({
      path: "/shared-article?url=" + encodeURIComponent("https://example.com/a?b=1&c=2"),
    });
  });

  it("opens a title + link shared as text as an article", () => {
    expect(destinationOf({ text: "Regeringen vil sænke skatten https://www.dr.dk/nyheder/b" })).toEqual({
      path: "/shared-article?url=" + encodeURIComponent("https://www.dr.dk/nyheder/b"),
    });
  });

  it("has nowhere to send an empty share", () => {
    expect(destinationOf({ text: "  " })).toBe(null);
    expect(destinationOf(null)).toBe(null);
  });
});
