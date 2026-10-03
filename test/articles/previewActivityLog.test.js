import { describe, expect, it } from "vitest";
import {
  PREVIEW_OUTCOME,
  countWords,
  createVisibleTimer,
  previewClosedExtraData,
  previewOpenedExtraData,
} from "../../src/articles/previewActivityLog";

function fakeClock(start = 1000) {
  let t = start;
  return { now: () => t, advance: (ms) => (t += ms) };
}

describe("createVisibleTimer", () => {
  it("counts only the time the page was visible", () => {
    const clock = fakeClock();
    const timer = createVisibleTimer(clock.now);
    clock.advance(3000);
    timer.pause();
    clock.advance(60_000); // backgrounded
    timer.resume();
    clock.advance(2000);
    expect(timer.elapsed()).toBe(5000);
  });

  it("ignores repeated pause/resume", () => {
    const clock = fakeClock();
    const timer = createVisibleTimer(clock.now);
    clock.advance(1000);
    timer.pause();
    timer.pause();
    clock.advance(1000);
    timer.resume();
    timer.resume();
    clock.advance(1000);
    expect(timer.elapsed()).toBe(2000);
  });

  it("starts paused when opened in a hidden page", () => {
    const clock = fakeClock();
    const timer = createVisibleTimer(clock.now, false);
    clock.advance(5000);
    expect(timer.elapsed()).toBe(0);
    timer.resume();
    clock.advance(1000);
    expect(timer.elapsed()).toBe(1000);
  });
});

describe("preview extra_data", () => {
  it("carries the article id and browsing session on open", () => {
    expect(JSON.parse(previewOpenedExtraData({ articleId: 42, browsingSessionId: 7 }))).toEqual({
      article_id: 42,
      browsing_session_id: 7,
    });
  });

  it("records outcome, rounded visible time and saved state on close", () => {
    const data = JSON.parse(
      previewClosedExtraData({
        articleId: 42,
        browsingSessionId: undefined,
        outcome: PREVIEW_OUTCOME.ORIGINAL,
        visibleMs: 1234.6,
        saved: undefined,
        title: "Ein  Titel",
        summary: undefined,
      }),
    );
    expect(data).toEqual({
      article_id: 42,
      browsing_session_id: null,
      outcome: "original",
      visible_ms: 1235,
      saved: false,
      title_words: 2,
      summary_words: 0,
    });
  });
});

describe("countWords", () => {
  it("counts whitespace-separated words, ignoring extra spacing", () => {
    expect(countWords("  Det er en\n god dag ")).toBe(5);
    expect(countWords("")).toBe(0);
    expect(countWords(null)).toBe(0);
  });
});
