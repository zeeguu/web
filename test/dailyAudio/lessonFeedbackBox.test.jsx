import { describe, it, expect, vi } from "vitest";
import { useContext, useState } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import LessonFeedbackBox, { takesFeedback } from "../../src/dailyAudio/LessonFeedbackBox";
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

function setup({ fails = false, lesson = LESSON, preferences = {}, response, extra = null } = {}) {
  const api = {
    sendLessonFeedback: vi.fn((id, aspect, value, ok, fail) => (fails ? fail(new Error("500")) : ok && ok(response))),
  };
  function Harness() {
    const [lessonData, setLessonData] = useState(lesson);
    const [userPreferences, setUserPreferences] = useState(preferences);
    return (
      <UserContext.Provider value={{ userPreferences, setUserPreferences }}>
        <LessonFeedbackBox lessonData={lessonData} setLessonData={setLessonData} api={api} />
        {extra}
      </UserContext.Provider>
    );
  }
  render(
    <MemoryRouter>
      <Harness />
    </MemoryRouter>,
  );
  return api;
}

const pill = (group, name) =>
  [...screen.getByRole("radiogroup", { name: group }).querySelectorAll("button")].find((b) => b.textContent === name);

describe("LessonFeedbackBox", () => {
  it("saves what the next lesson should do, and shows the answer selected", () => {
    const api = setup();
    fireEvent.click(pill("Pace", "Too slow"));

    expect(api.sendLessonFeedback).toHaveBeenCalledWith(
      7,
      "pace",
      "faster",
      expect.any(Function),
      expect.any(Function),
    );
    expect(pill("Pace", "Too slow").getAttribute("aria-checked")).toBe("true");
  });

  it("offers staying and the three suggested situations", () => {
    const api = setup();
    expect(screen.getByText(/11 lessons in "grocery shopping"/)).toBeTruthy();

    fireEvent.click(pill("Next lesson", 'Try "asking the time"'));
    expect(api.sendLessonFeedback).toHaveBeenCalledWith(
      7,
      "situation",
      "asking the time",
      expect.any(Function),
      expect.any(Function),
    );
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

  it("says Thanks once both are answered, then leaves only the situations to choose from", () => {
    vi.useFakeTimers();
    setup();
    fireEvent.click(pill("Pace", "Too slow"));
    fireEvent.click(pill("Repetition", "Too much"));

    expect(screen.getByText("Thanks!")).toBeTruthy();
    expect(screen.queryByRole("radiogroup", { name: "Pace" })).toBeNull();
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.queryByText("Thanks!")).toBeNull();
    // The situation choice stays until one is made, then the box is gone
    expect(screen.getByRole("radiogroup", { name: "Next lesson" })).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: 'Try "asking the time"' }));
    expect(screen.queryByRole("radiogroup", { name: "Next lesson" })).toBeNull();
    vi.useRealTimers();
  });

  it("shows nothing for a lesson answered before, without situations to choose", () => {
    setup({ lesson: { ...LESSON, next_situations: [], feedback: { pace: "just_right", repetition: "less" } } });
    expect(screen.queryByText("How was this lesson?")).toBeNull();
    expect(screen.queryByText("Thanks!")).toBeNull();
  });

  it("only asks: the length and time to answer are in Settings > Audio lessons", () => {
    setup({ preferences: { audio_lesson_minutes: "15", audio_lesson_answer_time: "1" } });
    expect(screen.queryByRole("radiogroup", { name: "Length" })).toBeNull();
    expect(screen.queryByText(/Lessons are about|Time to answer/)).toBeNull();
  });
});

describe("Time to answer", () => {
  it("keeps the setting a pace answer moved in the context, for Settings > Audio lessons", () => {
    let preferences;
    function Spy() {
      preferences = useContext(UserContext).userPreferences;
      return null;
    }
    setup({ preferences: { audio_lesson_answer_time: "0" }, response: { answer_time: 1 }, extra: <Spy /> });
    fireEvent.click(pill("Pace", "Too fast"));
    expect(preferences.audio_lesson_answer_time).toBe("1");
  });
});

describe("takesFeedback", () => {
  it("follows the API's takes_feedback, at any level", () => {
    expect(takesFeedback({ takes_feedback: true, cefr_level: "B1" })).toBe(true);
    expect(takesFeedback({ takes_feedback: false, cefr_level: "A0" })).toBe(false);
  });

  it("falls back to A0 only when the API does not send it (before api#1000)", () => {
    expect(takesFeedback({ cefr_level: "A0" })).toBe(true);
    expect(takesFeedback({ cefr_level: "B1" })).toBe(false);
  });
});
