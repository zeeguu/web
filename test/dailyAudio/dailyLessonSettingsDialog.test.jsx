import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { UserContext } from "../../src/contexts/UserContext";
import DailyLessonSettingsDialog from "../../src/dailyAudio/DailyLessonSettingsDialog";

/**
 * At A0 every daily lesson is a situation, so the dialog offers no other type.
 */
function setup(level, { initialType = null, initialSuggestion = "", preferences = {}, saveFails = false } = {}) {
  const calls = [];
  const api = {
    checkDailyLessonFeasibility: vi.fn((ok) => ok({ feasible: true })),
    getUserPreferences: vi.fn(() => Promise.resolve(preferences)),
    saveUserPreferences: vi.fn((prefs, ok, fail) => {
      calls.push("preferences");
      saveFails ? fail("HTTP 500") : ok("OK");
    }),
  };
  const onSubmit = vi.fn(() => calls.push("situation"));
  const onDismiss = vi.fn();
  render(
    <UserContext.Provider value={{ userDetails: { learned_language: "da", da_cefr_level: level } }}>
      <DailyLessonSettingsDialog
        api={api}
        initialType={initialType}
        initialSuggestion={initialSuggestion}
        alreadySubscribed={false}
        onSubmit={onSubmit}
        onDismiss={onDismiss}
      />
    </UserContext.Provider>,
  );
  return { api, onSubmit, onDismiss, calls };
}

describe("DailyLessonSettingsDialog", () => {
  it("offers all three types above A0, and no role", () => {
    const { api } = setup(1);
    expect(screen.getAllByRole("radio").map((r) => r.textContent)).toEqual(["Vocabulary", "Topic", "Situation"]);
    expect(screen.getByText("Daily lesson type")).toBeTruthy();
    expect(screen.queryByText("In the dialogues you speak as")).toBeNull();
    expect(api.getUserPreferences).not.toHaveBeenCalled();
  });

  it("offers only situations at A0, even to someone who had chosen a topic", () => {
    const { api, onSubmit } = setup(0, { initialType: "topic", initialSuggestion: "football" });
    expect(screen.queryAllByRole("radio")).toEqual([]);
    expect(screen.getByText("Daily situation")).toBeTruthy();
    expect(api.checkDailyLessonFeasibility).not.toHaveBeenCalled();

    const input = screen.getByPlaceholderText(/ordering a coffee/);
    expect(input.value).toBe("");
    fireEvent.change(input, { target: { value: "at the bakery" } });
    fireEvent.click(screen.getByText("Save settings"));
    expect(onSubmit).toHaveBeenCalledWith("situation", "at the bakery", true);
  });

  it("at A0 shows the saved role, and saving only a new role leaves the situation alone", async () => {
    const { api, onSubmit, onDismiss } = setup(0, {
      initialType: "situation",
      initialSuggestion: "at a café",
      preferences: { audio_lesson_character: "woman" },
    });
    await screen.findByText("In the dialogues you speak as");
    expect(screen.getByRole("radio", { name: "A woman" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.queryByText("Save settings")).toBeNull();

    fireEvent.click(screen.getByRole("radio", { name: "A man" }));
    fireEvent.click(screen.getByText("Save settings"));
    expect(api.saveUserPreferences).toHaveBeenCalledWith(
      { audio_lesson_character: "man" },
      expect.any(Function),
      expect.any(Function),
    );
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onDismiss).toHaveBeenCalled();
  });

  it("starts on Either, and saves the role before the situation", async () => {
    const { calls } = setup(0);
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: "Either" }).getAttribute("aria-checked")).toBe("true"),
    );
    fireEvent.click(screen.getByRole("radio", { name: "A woman" }));
    fireEvent.change(screen.getByPlaceholderText(/ordering a coffee/), { target: { value: "at the bakery" } });
    fireEvent.click(screen.getByText("Save settings"));
    expect(calls).toEqual(["preferences", "situation"]);
  });

  it("says so when the role could not be saved, and goes no further", async () => {
    const { onSubmit, onDismiss } = setup(0, { saveFails: true });
    await screen.findByText("In the dialogues you speak as");
    fireEvent.click(screen.getByRole("radio", { name: "A man" }));
    fireEvent.click(screen.getByText("Save settings"));
    expect(screen.getByRole("alert").textContent).toMatch(/Could not save/);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
