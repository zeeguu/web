import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import AnswerNote from "../../../src/exercises/components/AnswerNote";

// The answer is no longer on screen once the exercise ends, so the line
// must name both what was typed and what was expected.
describe("AnswerNote", () => {
  it("names the typed translation and the stored one", () => {
    const { container } = render(
      <AnswerNote note={{ kind: "alternative", typed: " consult " }} expected="to look up" isTranslation />,
    );
    expect(container.textContent).toBe("consult is also right. Your saved translation is to look up.");
  });

  it("adds the judge's explanation to a near miss", () => {
    const { container } = render(
      <AnswerNote note={{ kind: "nearMiss", typed: "search", explanation: "It needs 'for'." }} expected="look up" isTranslation />,
    );
    expect(container.textContent).toBe("search is close, but here it means look up. It needs 'for'.");
  });

  it("names the typed word in a cloze", () => {
    const { container } = render(<AnswerNote note={{ kind: "alternative", typed: "tænker" }} expected="synes" />);
    expect(container.textContent).toBe("tænker is also right. The word you're practising here is synes.");
  });

  it("shows nothing without a verdict", () => {
    const { container } = render(<AnswerNote note={null} expected="synes" />);
    expect(container.textContent).toBe("");
  });
});
