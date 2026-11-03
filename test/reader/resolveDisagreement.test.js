import { describe, it, expect, vi, beforeEach } from "vitest";
import InteractiveText from "../../src/reader/InteractiveText";
import { pushDrillVocab } from "../../src/assorted/drillCache";

vi.mock("../../src/assorted/drillCache", async (importOriginal) => ({
  ...(await importOriginal()),
  pushDrillVocab: vi.fn(),
}));

/**
 * The translators disagreed on a lookup; the API asks an LLM. Its answer
 * replaces what the reader shows only if the learner hasn't changed the
 * translation while waiting.
 */

const tok = (text, token_i) => ({ text, token_i, sent_i: 0, paragraph_i: 0 });

function setUp(apiAnswer) {
  const api = {
    TRANSLATE_TEXT: "TRANSLATE TEXT",
    resolveTranslationDisagreement: vi.fn(() => apiAnswer),
  };
  const text = new InteractiveText({
    tokenizedParagraphs: [[[tok("For", 0), tok("bonde", 1), tok("i", 2), tok("kongespil", 3)]]],
    previousBookmarks: [],
    api,
    language: "da",
    zeeguuSpeech: { language: "da" },
  });
  const word = text.getParagraphs()[0].getWords()[1];
  word.translation = "a farmer";
  word.bookmark_id = 7;
  word.alternatives = [{ translation: "a farmer" }, { translation: "a pawn" }];
  return { api, word, text };
}

const settle = (text, word) =>
  new Promise((resolve) => text.resolveDisagreement(word, (changed) => resolve({ changed }), (e) => resolve({ e })));

describe("resolveDisagreement", () => {
  beforeEach(() => vi.mocked(pushDrillVocab).mockClear());

  it("swaps in a different answer and the drill learns it", async () => {
    const answer = { translation: "a pawn", reason: "In chess.", changed: true };
    const { api, word, text } = setUp(Promise.resolve(answer));

    expect(await settle(text, word)).toEqual({ changed: true });

    expect(word.translation).toBe("a pawn");
    expect(word.resolution).toEqual(answer);
    expect(api.resolveTranslationDisagreement.mock.calls[0].slice(4)).toEqual([["a farmer", "a pawn"], "a farmer", 7]);
    expect(pushDrillVocab).toHaveBeenCalledWith("da", [{ o: "bonde", t: "a pawn" }], "translation");
  });

  it("keeps a translation the learner picked while waiting", async () => {
    let answer;
    const { word, text } = setUp(new Promise((r) => (answer = r)));
    const settled = settle(text, word);
    word.translation = "a peasant";
    answer({ translation: "a pawn", reason: "", changed: true });

    expect(await settled).toEqual({ changed: false });
    expect(word.translation).toBe("a peasant");
    expect(word.resolution).toBeUndefined();
  });

  it("leaves the word alone when the call fails", async () => {
    const { word, text } = setUp(Promise.reject(new Error("timeout")));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const outcome = await settle(text, word);

    expect(outcome.e).toBeInstanceOf(Error);
    expect(word.translation).toBe("a farmer");
    expect(word.resolution).toBeUndefined();
  });
});
