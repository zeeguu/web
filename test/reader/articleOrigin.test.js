import { describe, it, expect, beforeEach } from "vitest";
import {
  articleOpenOrigin,
  isReaderPath,
  noteArticleListFilter,
  noteLocation,
  originOf,
} from "../../src/reader/articleOrigin";

function visit(pathname) {
  window.history.pushState({}, "", pathname);
  noteLocation(pathname);
}

describe("originOf", () => {
  it("names the Read tabs", () => {
    expect(originOf("/articles")).toBe("news");
    expect(originOf("/articles/evergreen")).toBe("evergreen");
    expect(originOf("/articles/shared")).toBe("inbox");
  });

  it("adds the list's filter", () => {
    expect(originOf("/articles", "search")).toBe("news:search");
    expect(originOf("/articles/evergreen", "keyword")).toBe("evergreen:keyword");
  });

  it("falls back to the first part of other pages, and to direct", () => {
    expect(originOf("/daily-audio/today")).toBe("daily-audio");
    expect(originOf(null)).toBe("direct");
  });
});

describe("articleOpenOrigin", () => {
  beforeEach(() => {
    noteArticleListFilter(null);
  });

  it("is the last page that was not the reader", () => {
    visit("/articles/evergreen");
    visit("/read/article");
    visit("/read/abc123"); // the reader swapping to a simplified copy
    expect(articleOpenOrigin()).toBe("evergreen");
  });

  it("carries the filter of that page, and only of that page", () => {
    visit("/articles");
    noteArticleListFilter("search");
    visit("/read/article");
    expect(articleOpenOrigin()).toBe("news:search");

    visit("/articles/shared/");
    visit("/read/article");
    expect(articleOpenOrigin()).toBe("inbox");
  });

  it("knows the reader's addresses", () => {
    expect(isReaderPath("/read/article")).toBe(true);
    expect(isReaderPath("/read")).toBe(true);
    expect(isReaderPath("/reading-history")).toBe(false);
  });
});
