import { describe, it, expect, vi } from "vitest";
import InteractiveText from "../../src/reader/InteractiveText";

/**
 * Explain on a word an LLM settled shows the reason it already gave, as long
 * as the word still shows that answer; otherwise it asks the API as usual.
 */

const tok = (text, token_i) => ({ text, token_i, sent_i: 0, paragraph_i: 0 });

function setUp() {
  const api = {
    EXPLAIN_SELECTION: "EXPLAIN SELECTION",
    logUserActivity: vi.fn(),
    explainSelection: vi.fn(() => Promise.resolve({ explanation: "From the API." })),
  };
  const text = new InteractiveText({
    tokenizedParagraphs: [[[tok("For", 0), tok("bonde", 1), tok("i", 2), tok("kongespil", 3)]]],
    previousBookmarks: [],
    api,
    language: "da",
    zeeguuSpeech: { language: "da" },
  });
  const word = text.getParagraphs()[0].getWords()[1];
  word.translation = "a pawn";
  word.resolution = { translation: "a pawn", reason: "In chess.", changed: true };
  return { api, word, text };
}

const explain = (text, word) =>
  new Promise((resolve) => text.explainSelection(word, resolve, () => resolve(null)));

describe("explainSelection on a settled word", () => {
  it("shows the settled reason without calling the API", async () => {
    const { api, word, text } = setUp();
    const result = await explain(text, word);
    expect(result.explanation).toBe("In chess.");
    expect(api.explainSelection).not.toHaveBeenCalled();
    expect(api.logUserActivity).toHaveBeenCalled();
  });

  it("asks the API once the learner picked another translation", async () => {
    const { api, word, text } = setUp();
    word.translation = "a farmer";
    const result = await explain(text, word);
    expect(result.explanation).toBe("From the API.");
    expect(api.explainSelection).toHaveBeenCalledTimes(1);
  });
});
