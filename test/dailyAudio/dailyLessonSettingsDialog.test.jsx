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
    getAudioLessonSituations: vi.fn((language, ok) =>
      ok([
        { raw_suggestion: "ordering at a café", canonical_suggestion: "café", lessons: 3 },
        { raw_suggestion: "Gaming", canonical_suggestion: "gaming", lessons: 1 },
      ]),
    ),
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

  it("offers only situations at A0, from a list, even to someone who had chosen a topic", () => {
    const { api, onSubmit } = setup(0, { initialType: "topic", initialSuggestion: "football" });
    expect(screen.queryByRole("radio", { name: "Topic" })).toBeNull();
    expect(screen.getByText("Daily situation")).toBeTruthy();
    expect(api.checkDailyLessonFeasibility).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("radio", { name: /I don't understand/ }));
    fireEvent.click(screen.getByText("Save settings"));
    expect(onSubmit).toHaveBeenCalledWith("situation", "saying you don't understand and asking for English", true);
  });

  it("at A0 recommends the current situation and the next three not had yet", () => {
    setup(0, { initialType: "situation", initialSuggestion: "ordering at a café" });
    expect(screen.getAllByRole("radio", { name: /^(?!A man|A woman|Either)/ }).map((r) => r.textContent)).toEqual([
      "☕ At the café · 3",
      "👋 Hello and introductions",
      "🤷 I don't understand",
      "🛒 At the supermarket",
    ]);
    expect(screen.getByRole("radio", { name: /At the café/ }).getAttribute("aria-checked")).toBe("true");
  });

  it("at A0 shows the whole list, and Other, on More situations", () => {
    setup(0);
    expect(screen.queryByRole("radio", { name: /At the bakery/ })).toBeNull();
    fireEvent.click(screen.getByText("More situations…"));
    expect(screen.getByRole("radio", { name: /At the bakery/ }).textContent).toBe("🥐 At the bakery");
    expect(screen.getByRole("radio", { name: "Other…" })).toBeTruthy();
  });

  it("at A0 keeps the learner's own situation under Other", () => {
    const { onSubmit } = setup(0, { initialType: "situation", initialSuggestion: "Gaming" });
    expect(screen.getByRole("radio", { name: "Other…" }).getAttribute("aria-checked")).toBe("true");
    const input = screen.getByPlaceholderText(/post office/);
    expect(input.value).toBe("Gaming");

    fireEvent.change(input, { target: { value: "at the post office" } });
    fireEvent.click(screen.getByText("Save settings"));
    expect(onSubmit).toHaveBeenCalledWith("situation", "at the post office", true);
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
    fireEvent.click(screen.getByRole("radio", { name: /Hello/ }));
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
