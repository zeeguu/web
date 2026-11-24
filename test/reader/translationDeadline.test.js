import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { translationDeadline, TRANSLATION_DEADLINE_MS } from "../../src/reader/translationDeadline";
import InteractiveText from "../../src/reader/InteractiveText";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("translationDeadline", () => {
  it("gives up after the deadline", () => {
    const onGiveUp = vi.fn();
    translationDeadline(onGiveUp);
    vi.advanceTimersByTime(TRANSLATION_DEADLINE_MS - 1);
    expect(onGiveUp).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onGiveUp).toHaveBeenCalledTimes(1);
  });

  it("does not give up once settled in time", () => {
    const onGiveUp = vi.fn();
    const deadline = translationDeadline(onGiveUp);
    expect(deadline.settle()).toBe(true);
    vi.advanceTimersByTime(TRANSLATION_DEADLINE_MS * 2);
    expect(onGiveUp).not.toHaveBeenCalled();
  });

  it("reports a late or second settle as not in time", () => {
    const deadline = translationDeadline(() => {});
    vi.advanceTimersByTime(TRANSLATION_DEADLINE_MS);
    expect(deadline.settle()).toBe(false);

    const other = translationDeadline(() => {});
    other.settle();
    expect(other.settle()).toBe(false);
  });
});

const tok = (text, token_i) => ({ text, token_i, sent_i: 0, paragraph_i: 0 });

const textWith = (getOneTranslation) =>
  new InteractiveText({
    tokenizedParagraphs: [[[tok("Den", 0), tok("ser", 1), tok(".", 2)]]],
    previousBookmarks: [],
    api: { TRANSLATE_TEXT: "TRANSLATE TEXT", getOneTranslation, logUserActivity: vi.fn() },
    language: "da",
    zeeguuSpeech: { language: "da" },
  });

const firstWord = (text) => text.getParagraphs()[0].getWords()[1];

describe("InteractiveText.translate stops the loading animation", () => {
  it("when the request never answers", () => {
    const text = textWith(() => new Promise(() => {}));
    const onSuccess = vi.fn();
    const onError = vi.fn();
    text.translate(firstWord(text), false, onSuccess, null, onError);

    vi.advanceTimersByTime(TRANSLATION_DEADLINE_MS);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("when applying the answer throws, and only once", async () => {
    const text = textWith(() => Promise.resolve({ data: { translation: "sees" } }));
    const word = firstWord(text);
    word.updateTranslation = () => {
      throw new Error("boom");
    };
    const onError = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => {});
    text.translate(word, false, vi.fn(), null, onError);

    await vi.runAllTimersAsync();
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
