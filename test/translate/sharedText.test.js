import { describe, it, expect, vi } from "vitest";
import {
  classifySharedText,
  deliverSharedText,
  takePendingSharedText,
  onSharedText,
} from "../../src/translate/sharedText";

describe("classifySharedText", () => {
  it("reads a chat message as a message", () => {
    const text = "Hej alle! Træningen i morgen er aflyst, fordi banen er lukket.";
    expect(classifySharedText(text)).toEqual({ kind: "message", text });
  });

  it("opens a bare link as an article", () => {
    expect(classifySharedText("https://www.dr.dk/nyheder/a")).toEqual({
      kind: "article",
      url: "https://www.dr.dk/nyheder/a",
    });
  });

  it("opens a link with a title around it as an article", () => {
    expect(classifySharedText("Regeringen vil sænke skatten https://www.dr.dk/nyheder/b")).toEqual({
      kind: "article",
      url: "https://www.dr.dk/nyheder/b",
    });
  });

  it("reads a long message that happens to contain a link as a message", () => {
    const text =
      "Hej forældre, husk at tilmelde jeres børn til stævnet på lørdag senest torsdag aften, " +
      "ellers kan vi ikke nå at bestille bus: https://forms.example.com/stævne";
    expect(classifySharedText(text)).toEqual({ kind: "message", text });
  });

  it("uses the url the share target passed separately", () => {
    expect(classifySharedText("", "https://example.com/x")).toEqual({ kind: "article", url: "https://example.com/x" });
  });

  it("finds nothing in an empty share", () => {
    expect(classifySharedText("  ", "")).toEqual({ kind: "nothing" });
  });
});

describe("shared text inbox", () => {
  it("keeps a message that arrives before the page listens", () => {
    deliverSharedText("Hej");
    expect(takePendingSharedText()).toBe("Hej");
    expect(takePendingSharedText()).toBe(null);
  });

  it("hands a message straight to an open page", () => {
    const fn = vi.fn();
    const stop = onSharedText(fn);
    deliverSharedText("Hej igen");
    expect(fn).toHaveBeenCalledWith("Hej igen");
    expect(takePendingSharedText()).toBe(null);
    stop();
    deliverSharedText("Senere");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(takePendingSharedText()).toBe("Senere");
  });
});
