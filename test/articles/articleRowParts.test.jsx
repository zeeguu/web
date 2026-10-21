import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import ArticleThumbnail from "../../src/articles/ArticleThumbnail";
import ReadingCompletion from "../../src/articles/ReadingCompletion";

// The pieces SavedArticleRow, SharedArticleRow and the Aiki page share.
describe("article row parts", () => {
  it("shows the article's image, or a placeholder glyph without one", () => {
    const { container, rerender } = render(<ArticleThumbnail article={{ img_url: "https://x/y.jpg" }} />);
    expect(container.querySelector("img").getAttribute("src")).toBe("https://x/y.jpg");

    rerender(<ArticleThumbnail article={{ topics_list: [] }} />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("says how far the learner read", () => {
    const { container, rerender } = render(<ReadingCompletion ratio={0.4} />);
    expect(screen.getByText("40% read")).toBeTruthy();

    rerender(<ReadingCompletion ratio={1} />);
    expect(screen.getByText(/Read/)).toBeTruthy();

    rerender(<ReadingCompletion ratio={0} />);
    expect(container.textContent).toBe("");
  });
});
