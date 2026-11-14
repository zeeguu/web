import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import LessonFeedbackBox from "../../src/dailyAudio/LessonFeedbackBox";

const LESSON = {
  lesson_id: 7,
  canonical_suggestion: "grocery shopping",
  situation_lesson_count: 11,
  next_situations: ["at the bakery", "asking the time", "taking the bus"],
  feedback: {},
};

function setup({ fails = false, lesson = LESSON } = {}) {
  const api = {
    sendLessonFeedback: vi.fn((id, aspect, value, ok, fail) => (fails ? fail(new Error("500")) : ok && ok())),
  };
  function Harness() {
    const [lessonData, setLessonData] = useState(lesson);
    return <LessonFeedbackBox lessonData={lessonData} setLessonData={setLessonData} api={api} />;
  }
  render(<Harness />);
  return api;
}

const pill = (group, name) =>
  [...screen.getByRole("radiogroup", { name: group }).querySelectorAll("button")].find(
    (b) => b.textContent === name,
  );

describe("LessonFeedbackBox", () => {
  it("saves a tap and shows it selected", () => {
    const api = setup();
    fireEvent.click(pill("Pace", "Faster"));

    expect(api.sendLessonFeedback).toHaveBeenCalledWith(7, "pace", "faster", null, expect.any(Function));
    expect(pill("Pace", "Faster").getAttribute("aria-checked")).toBe("true");
  });

  it("offers staying and the three suggested situations", () => {
    const api = setup();
    expect(screen.getByText(/11 lessons in "grocery shopping"/)).toBeTruthy();

    fireEvent.click(pill("Next lesson", 'Try "asking the time"'));
    expect(api.sendLessonFeedback).toHaveBeenCalledWith(7, "situation", "asking the time", null, expect.any(Function));
    expect(pill("Next lesson", 'Try "asking the time"').getAttribute("aria-checked")).toBe("true");
    expect(pill("Next lesson", 'Stay with "grocery shopping"').getAttribute("aria-checked")).toBe("false");
  });

  it("puts the old answer back when saving fails", () => {
    setup({ fails: true });
    fireEvent.click(pill("Repetition", "Less"));

    expect(pill("Repetition", "Less").getAttribute("aria-checked")).toBe("false");
    expect(screen.getByText(/Could not save/)).toBeTruthy();
  });

  it("has no situation row without suggestions", () => {
    setup({ lesson: { ...LESSON, next_situations: [] } });
    expect(screen.queryByRole("radiogroup", { name: "Next lesson" })).toBeNull();
  });
});
