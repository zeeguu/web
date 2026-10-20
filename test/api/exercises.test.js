import { describe, it, expect, vi } from "vitest";
import { Zeeguu_API } from "../../src/api/classDef";
import "../../src/api/exercises";

// Right after a language switch the server may not have saved the new language
// yet, so the exercises have to name it -- otherwise the session gets the
// previous language's words, pronounced in the new language's voice.
describe("exercises requests name the language", () => {
  function requestedEndpoint(call) {
    const api = new Zeeguu_API("https://api.zeeguu.org");
    api._getJSON = vi.fn();
    call(api);
    return api._getJSON.mock.calls[0][0];
  }

  it("for the words to practise", () => {
    expect(requestedEndpoint((api) => api.getBookmarksRecommendedForPractice("bg", () => {}))).toBe(
      "user_words_recommended_for_practice?language=bg",
    );
  });

  it("for the count behind the badge", () => {
    expect(requestedEndpoint((api) => api.getCountOfBookmarksRecommendedForPractice("da", () => {}))).toBe(
      "count_of_user_words_recommended_for_practice?language=da",
    );
  });

  it("encodes codes with a region", () => {
    expect(requestedEndpoint((api) => api.getUserWordsRecommendedForPractice("zh-CN", () => {}))).toBe(
      "user_words_recommended_for_practice?language=zh-CN",
    );
  });

  it("leaves the language to the server when none is known", () => {
    expect(requestedEndpoint((api) => api.getUserWordsRecommendedForPractice(undefined, () => {}))).toBe(
      "user_words_recommended_for_practice",
    );
  });
});
