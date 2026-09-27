import { describe, it, expect } from "vitest";
import { summaryIsAiGenerated, aiProvenanceLabel } from "../../src/utils/misc/articleHelpers";

// The heading above the summary answers a narrower question than the card's
// single mark: is THIS summary model-written? Over-claiming on a teacher's
// uploaded text would be a false disclosure, so that case is the one to guard.
describe("summary provenance", () => {
  const cases = [
    ["crawler article with a summary", { summary: "s" }, true, "AI summary"],
    ["crawler article, no summary", {}, false, null],
    ["uploaded text (summary is truncated prose)", { summary: "s", has_uploader: true }, false, null],
    ["simplified article", { summary: "s", parent_article_id: 7 }, true, "AI-simplified"],
    // Inherits the uploader but is machine-written throughout.
    ["simplified copy of an uploaded text", { summary: "s", parent_article_id: 7, has_uploader: true }, true, "AI-simplified"],
  ];

  it.each(cases)("%s", (_name, article, headingSaysAi, cardLabel) => {
    expect(summaryIsAiGenerated(article)).toBe(headingSaysAi);
    expect(aiProvenanceLabel(article)).toBe(cardLabel);
  });
});
