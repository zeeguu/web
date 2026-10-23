import { vi } from "vitest";
import { Zeeguu_API } from "../../src/api/classDef";
import { bundledPayload } from "../../src/hooks/useArticlePreviewTokens";

// Stubbed: newer Node ships its own global localStorage, which shadows jsdom's.
// The cache key reads the learned language and variety from it.
vi.stubGlobal("localStorage", { getItem: () => null });

// The feed bundles each card's tokens with the learner's past bookmarks, and
// caches the response for 5 minutes. After a bookmark changes on a card, a
// rebuild from that bundle undid the change: a deleted translation came back,
// a new one was missing. Forgetting the article's bundle makes its next build
// fetch the tokens, while the rest of the feed stays cached.

const article = (id) => ({
  id,
  title: "Rusland fløj tæt på finsk satellit i rummet",
  summary: "En russisk spionsatellit fløj ...",
  interactiveTitle: { tokens: [], past_bookmarks: [] },
  interactiveSummary: { tokens: [], past_bookmarks: [] },
});

function cache(api, endpoint, data) {
  api._cache.set(api._cacheKey(endpoint), { time: Date.now(), data });
}

describe("forgetting an article's bundled tokens", () => {
  test("reaches every cached feed that holds the article", () => {
    const api = new Zeeguu_API("https://api.zeeguu.org");
    // Each topic pill caches its own response, with its own copy of the article.
    cache(api, "user_articles/recommended?language=da", [article(1), article(2)]);
    cache(api, "user_articles/recommended?topic=3&language=da", [article(1)]);

    api.forgetArticleTokens(1);

    expect(bundledPayload(api.getCached("user_articles/recommended?language=da")[0])).toBeNull();
    expect(bundledPayload(api.getCached("user_articles/recommended?topic=3&language=da")[0])).toBeNull();
  });

  test("leaves the other articles on their bundle", () => {
    const api = new Zeeguu_API("https://api.zeeguu.org");
    cache(api, "user_articles/recommended?language=da", [article(1), article(2)]);

    api.forgetArticleTokens(1);

    expect(bundledPayload(api.getCached("user_articles/recommended?language=da")[1])).not.toBeNull();
  });

  test("ignores cached responses that are not article lists", () => {
    const api = new Zeeguu_API("https://api.zeeguu.org");
    cache(api, "user_articles/recommended?language=da", null);
    cache(api, "system_languages", { learnable_languages: [] });

    expect(() => api.forgetArticleTokens(1)).not.toThrow();
  });
});
