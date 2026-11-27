import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import LessonFeedbackBox, { feedbackSummary } from "../../src/dailyAudio/LessonFeedbackBox";
import { UserContext } from "../../src/contexts/UserContext";

vi.mock("../../src/utils/chimes", () => ({ playHappyChime: vi.fn(), playDoneChime: vi.fn() }));

const LESSON = {
  lesson_id: 7,
  takes_feedback: true,
  builds_on_history: true, // an A0 lesson: its length is a setting
  canonical_suggestion: "grocery shopping",
  situation_lesson_count: 11,
  next_situations: ["at the bakery", "asking the time", "taking the bus"],
  feedback: {},
};

function setup({ fails = false, lesson = LESSON, preferences = {}, onOpenSettings } = {}) {
  const api = {
    sendLessonFeedback: vi.fn((id, aspect, value, ok, fail) => (fails ? fail(new Error("500")) : ok && ok())),
  };
  function Harness() {
    const [lessonData, setLessonData] = useState(lesson);
    return (
      <UserContext.Provider value={{ userPreferences: preferences }}>
        <LessonFeedbackBox
          lessonData={lessonData}
          setLessonData={setLessonData}
          api={api}
          onOpenSettings={onOpenSettings}
        />
      </UserContext.Provider>
    );
  }
  render(<Harness />);
  return api;
}

const pill = (group, name) =>
  [...screen.getByRole("radiogroup", { name: group }).querySelectorAll("button")].find((b) => b.textContent === name);

describe("LessonFeedbackBox", () => {
  it("saves what the next lesson should do, and shows the answer selected", () => {
    const api = setup();
    fireEvent.click(pill("Pace", "Too slow"));

    expect(api.sendLessonFeedback).toHaveBeenCalledWith(7, "pace", "faster", null, expect.any(Function));
    expect(pill("Pace", "Too slow").getAttribute("aria-checked")).toBe("true");
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
    fireEvent.click(pill("Repetition", "Too much"));

    expect(pill("Repetition", "Too much").getAttribute("aria-checked")).toBe("false");
    expect(screen.getByText(/Could not save/)).toBeTruthy();
  });

  it("has no situation row without suggestions", () => {
    setup({ lesson: { ...LESSON, next_situations: [] } });
    expect(screen.queryByRole("radiogroup", { name: "Next lesson" })).toBeNull();
  });

  it("folds into what the answers change once both are answered, and opens again on Change", () => {
    setup();
    fireEvent.click(pill("Pace", "Too slow"));
    fireEvent.click(pill("Repetition", "Too much"));

    expect(screen.getByText("Thanks!")).toBeTruthy();
    expect(
      screen.getByText("Based on your feedback, your next lesson will be a bit faster and with less repetition."),
    ).toBeTruthy();
    expect(screen.queryByRole("radiogroup", { name: "Pace" })).toBeNull();
    // The situation choice stays open.
    expect(screen.getByRole("radiogroup", { name: "Next lesson" })).toBeTruthy();

    fireEvent.click(screen.getByText("Change"));
    expect(pill("Pace", "Too slow").getAttribute("aria-checked")).toBe("true");
  });

  it("does not ask about length: it says the chosen length and links to the setting", () => {
    const onOpenSettings = vi.fn();
    setup({ preferences: { audio_lesson_minutes: "15" }, onOpenSettings });
    expect(screen.queryByRole("radiogroup", { name: "Length" })).toBeNull();
    expect(screen.getByText(/Lessons are about 15 minutes/)).toBeTruthy();

    fireEvent.click(screen.getByText("Change"));
    expect(onOpenSettings).toHaveBeenCalled();
  });

  it("says nothing of length after a lesson above A0, whose length is not a setting", () => {
    setup({ lesson: { ...LESSON, builds_on_history: false }, preferences: { audio_lesson_minutes: "15" } });
    expect(screen.queryByText(/Lessons are about/)).toBeNull();
    expect(screen.getByRole("radiogroup", { name: "Next lesson" })).toBeTruthy();
  });
});

describe("feedbackSummary", () => {
  it("says what changes", () => {
    expect(feedbackSummary({ pace: "slower", repetition: "more" })).toBe(
      "Based on your feedback, your next lesson will be a bit slower and with more repetition.",
    );
  });

  it("says nothing changes when everything was just right", () => {
    expect(feedbackSummary({ pace: "just_right", repetition: "just_right" })).toBe(
      "Your next lesson will be just like this one.",
    );
  });
});
