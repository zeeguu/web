import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../../../src/exercises/utils/useInteractiveTextForBookmark.js", () => ({
  useInteractiveTextForBookmark: () => ({}),
}));
vi.mock("../../../src/exercises/utils/useExerciseLifecycle.js", () => ({
  useExerciseLifecycle: () => {},
}));
vi.mock("../../../src/exercises/components/ContextWithExchange.js", () => ({
  default: () => <p>the context</p>,
}));

import RecallWord from "../../../src/exercises/exerciseTypes/recallTest/RecallWord";
import RecallMeaning from "../../../src/exercises/exerciseTypes/recallTest/RecallMeaning";

// A test of the word itself: what the learner gets is the translation, and
// nothing that would give the word away.
describe("RecallWord", () => {
  const bookmark = { id: 1, from: "synes", to: "thinks.", from_lang: "da", to_lang: "en", level: 3 };
  const show = (isExerciseOver, notify = {}, Exercise = RecallWord) =>
    render(
      <Exercise
        bookmarksToStudy={[bookmark]}
        setExerciseType={() => {}}
        resetSubSessionTimer={() => {}}
        isExerciseOver={isExerciseOver}
        {...notify}
      />,
    );

  it("asks for the word from its translation, with no hint and no context", () => {
    show(false);
    expect(screen.getByRole("heading", { name: "thinks" })).toBeTruthy();
    expect(screen.getByPlaceholderText(/^type in/i)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /hint/i })).toBeNull();
    expect(screen.queryByText("the context")).toBeNull();
  });

  it("lets them say they know it, then shows the word and asks whether they were right", async () => {
    const notifyCorrectAnswer = vi.fn();
    const notifyShowSolution = vi.fn();
    show(false, { notifyCorrectAnswer, notifyShowSolution });
    expect(screen.queryByText("synes")).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: /i know it/i }));
    expect(screen.getByText("synes")).toBeTruthy();
    expect(screen.queryByPlaceholderText(/^type in/i)).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: /yes/i }));
    expect(notifyCorrectAnswer).toHaveBeenCalledWith(bookmark);
    expect(notifyShowSolution).not.toHaveBeenCalled();
  });

  it("counts a No as not knowing it", async () => {
    const notifyCorrectAnswer = vi.fn();
    const notifyShowSolution = vi.fn();
    show(false, { notifyCorrectAnswer, notifyShowSolution });
    await userEvent.click(screen.getByRole("button", { name: /i know it/i }));
    await userEvent.click(screen.getByRole("button", { name: /^no$/i }));
    expect(notifyShowSolution).toHaveBeenCalled();
    expect(notifyCorrectAnswer).not.toHaveBeenCalled();
  });

  it("shows the context once answered", () => {
    show(true);
    expect(screen.getByText("the context")).toBeTruthy();
  });

  it("the other way round, asks for the meaning from the word", async () => {
    show(false, {}, RecallMeaning);
    expect(screen.getByRole("heading", { name: "synes" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /hint/i })).toBeNull();
    expect(screen.queryByText("the context")).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: /i know it/i }));
    expect(screen.getByText("thinks.")).toBeTruthy();
  });
});
