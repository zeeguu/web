import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../../../src/exercises/utils/useInteractiveTextForBookmark.js", () => ({
  useInteractiveTextForBookmark: () => ({}),
}));
vi.mock("../../../src/exercises/utils/useExerciseLifecycle.js", () => ({
  useExerciseLifecycle: () => {},
}));
vi.mock("../../../src/exercises/components/ContextWithExchange.js", () => ({
  default: () => <p>the context</p>,
}));

import RecallWord from "../../../src/exercises/exerciseTypes/recallWord/RecallWord";

// A test of the word itself: what the learner gets is the translation, and
// nothing that would give the word away.
describe("RecallWord", () => {
  const bookmark = { id: 1, from: "synes", to: "thinks.", from_lang: "da", to_lang: "en", level: 3 };
  const show = (isExerciseOver) =>
    render(
      <RecallWord
        bookmarksToStudy={[bookmark]}
        setExerciseType={() => {}}
        resetSubSessionTimer={() => {}}
        isExerciseOver={isExerciseOver}
      />,
    );

  it("asks for the word from its translation, with no hint and no context", () => {
    show(false);
    expect(screen.getByRole("heading", { name: "thinks" })).toBeTruthy();
    expect(screen.getByPlaceholderText(/^type in/i)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /hint/i })).toBeNull();
    expect(screen.queryByText("the context")).toBeNull();
  });

  it("shows the context once answered", () => {
    show(true);
    expect(screen.getByText("the context")).toBeTruthy();
  });
});
