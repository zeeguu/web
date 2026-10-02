import { describe, it, expect } from "vitest";

import { addHidden, removeHidden, visibleFeedItems } from "../../src/articles/hiddenArticles";

/**
 * The feed hides an article by filtering its id at render time, so a list
 * rebuilt from a snapshot (pagination, videos-only) can't bring it back, and
 * Undo is taking the id out again.
 */
describe("hidden feed articles", () => {
  const feed = [{ id: 1 }, { id: 2 }, { id: 3, video: true }];

  it("leaves out hidden articles, in order", () => {
    expect(visibleFeedItems(feed, addHidden(new Set(), 1))).toEqual([{ id: 2 }, { id: 3, video: true }]);
  });

  it("stays hidden in a list rebuilt from a snapshot", () => {
    const hidden = addHidden(new Set(), 2);
    const rebuilt = [...feed, { id: 4 }];
    expect(visibleFeedItems(rebuilt, hidden).map((each) => each.id)).toEqual([1, 3, 4]);
  });

  it("Undo puts the article back where it was", () => {
    const hidden = removeHidden(addHidden(new Set(), 2), 2);
    expect(visibleFeedItems(feed, hidden)).toEqual(feed);
  });

  it("never hides a video that happens to share a hidden article's id", () => {
    expect(visibleFeedItems(feed, addHidden(new Set(), 3))).toEqual(feed);
  });

  it("doesn't change the set it was given", () => {
    const hidden = new Set([1]);
    addHidden(hidden, 2);
    removeHidden(hidden, 1);
    expect([...hidden]).toEqual([1]);
  });
});
