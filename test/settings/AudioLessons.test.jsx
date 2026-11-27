import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { APIContext } from "../../src/contexts/APIContext";
import { UserContext } from "../../src/contexts/UserContext";
import AudioLessons from "../../src/pages/Settings/Pages/AudioLessons";

// RadioGroup's card styles do not parse in jsdom; what is tested here is which
// settings the page shows and what it saves, so plain radios stand in for it.
vi.mock("../../src/components/RadioGroup/RadioGroup", () => ({
  default: ({ options, selectedValue, onChange, optionValue, optionLabel, ariaLabel }) => (
    <div role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => (
        <label key={optionValue(option)}>
          <input
            type="radio"
            value={optionValue(option)}
            checked={selectedValue === optionValue(option)}
            onChange={onChange}
          />
          {optionLabel(option)}
        </label>
      ))}
    </div>
  ),
}));

// daily_goal_minutes: savePreferences saves only once the preferences are loaded
const LOADED = { daily_goal_minutes: "10", audio_lesson_answer_time: "0" };

function renderPage({ level = 3, preferences = LOADED } = {}) {
  const api = { saveUserPreferences: vi.fn((prefs, ok) => ok?.()) };
  render(
    <MemoryRouter>
      <APIContext.Provider value={api}>
        <UserContext.Provider
          value={{
            userDetails: { learned_language: "da", da_cefr_level: level },
            userPreferences: preferences,
            setUserPreferences: vi.fn(),
          }}
        >
          <AudioLessons />
        </UserContext.Provider>
      </APIContext.Provider>
    </MemoryRouter>,
  );
  return api;
}

describe("AudioLessons", () => {
  it("above A0 shows the time to answer only, and saves a choice", () => {
    const api = renderPage();
    expect(screen.getByRole("radio", { name: /^Normal/ }).checked).toBe(true);
    expect(screen.queryByText("Lesson length")).toBeNull();
    expect(screen.queryByText("In the dialogues you speak as")).toBeNull();

    fireEvent.click(screen.getByRole("radio", { name: /^More/ }));
    expect(api.saveUserPreferences).toHaveBeenCalledWith(
      { audio_lesson_answer_time: "1" },
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("at A0 also shows the lesson length and who the learner speaks as", () => {
    renderPage({
      level: 0,
      preferences: { ...LOADED, audio_lesson_minutes: "15", audio_lesson_character: "woman" },
    });
    expect(screen.getByRole("radio", { name: /About 15 minutes/ }).checked).toBe(true);
    expect(screen.getByRole("radio", { name: /A woman/ }).checked).toBe(true);
  });

  it("shows no time to answer when the API does not send it", () => {
    renderPage({ preferences: { daily_goal_minutes: "10" } });
    expect(screen.queryByText("Time to answer")).toBeNull();
  });
});
