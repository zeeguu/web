import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { UserContext } from "../../src/contexts/UserContext";
import DailyLessonSettingsDialog from "../../src/dailyAudio/DailyLessonSettingsDialog";

/**
 * At A0 every daily lesson is a situation, so the dialog offers no other type.
 */
function setup(
  level,
  {
    initialType = null,
    initialSuggestion = "",
    preferences = { audio_lesson_character: "man" },
    saveFails = false,
  } = {},
) {
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
    expect(screen.getAllByRole("radio", { name: /^(?!A man|A woman)/ }).map((r) => r.textContent)).toEqual([
      "☕ At the café · 3",
      "👋 Hello and introductions",
      "🤷 I don't understand",
      "🛒 At the supermarket",
    ]);
    expect(screen.getByRole("radio", { name: /At the café/ }).getAttribute("aria-checked")).toBe("true");
  });

  it("at A0 shows the whole list on More situations", () => {
    setup(0);
    expect(screen.queryByRole("radio", { name: /At the bakery/ })).toBeNull();
    fireEvent.click(screen.getByText("More situations"));
    expect(screen.getByRole("radio", { name: /At the bakery/ }).textContent).toBe("🥐 At the bakery");
    expect(screen.queryByText("More situations")).toBeNull();
  });

  it("at A0 opens a text field on Type your own", () => {
    const { onSubmit } = setup(0);
    fireEvent.click(screen.getByText("Type your own"));
    fireEvent.change(screen.getByPlaceholderText(/post office/), { target: { value: "at the post office" } });
    fireEvent.click(screen.getByText("Save settings"));
    expect(onSubmit).toHaveBeenCalledWith("situation", "at the post office", true);
  });

  it("at A0 Type your own shows only the field, and Back puts the list and the choice back", () => {
    setup(0, { initialType: "situation", initialSuggestion: "ordering at a café" });
    fireEvent.click(screen.getByText("Type your own"));
    expect(screen.queryByRole("radio", { name: /At the café/ })).toBeNull();
    fireEvent.change(screen.getByPlaceholderText(/post office/), { target: { value: "at the zoo" } });

    fireEvent.click(screen.getByText("← Back to the list"));
    expect(screen.queryByPlaceholderText(/post office/)).toBeNull();
    expect(screen.getByRole("radio", { name: /At the café/ }).getAttribute("aria-checked")).toBe("true");

    // What they typed is still there when they come back.
    fireEvent.click(screen.getByText("Type your own"));
    expect(screen.getByPlaceholderText(/post office/).value).toBe("at the zoo");
  });

  it("at A0 Type your own starts from the learner's own situation, to edit", () => {
    setup(0, { initialType: "situation", initialSuggestion: "Gaming" });
    fireEvent.click(screen.getByText("Type your own"));
    expect(screen.getByPlaceholderText(/post office/).value).toBe("Gaming");
  });

  it("at A0 shows the learner's own situation as a selected pill, without a text field", () => {
    const { onSubmit } = setup(0, { initialType: "situation", initialSuggestion: "Gaming" });
    const pill = screen.getByRole("radio", { name: /Gaming/ });
    expect(pill.textContent).toBe("✏️ Gaming · 1");
    expect(pill.getAttribute("aria-checked")).toBe("true");
    expect(screen.queryByPlaceholderText(/post office/)).toBeNull();

    fireEvent.click(screen.getByText("Type your own"));
    fireEvent.change(screen.getByPlaceholderText(/post office/), { target: { value: "at the post office" } });
    fireEvent.click(screen.getByText("Save settings"));
    expect(onSubmit).toHaveBeenCalledWith("situation", "at the post office", true);
  });

  it("at A0 does not ask for the role once it is chosen: that is in Settings > Audio lessons", async () => {
    const { api } = setup(0, {
      initialType: "situation",
      initialSuggestion: "at a café",
      preferences: { audio_lesson_character: "woman" },
    });
    await waitFor(() => expect(api.getUserPreferences).toHaveBeenCalled());
    expect(screen.queryByText("In the dialogues you speak as")).toBeNull();
  });

  it("offers only A man and A woman", async () => {
    setup(0, { preferences: {} });
    await screen.findByText("In the dialogues you speak as");
    expect(screen.getAllByRole("radio", { name: /^(A man|A woman|Either)$/ }).map((r) => r.textContent)).toEqual([
      "A man",
      "A woman",
    ]);
  });

  it.each([[{}], [{ audio_lesson_character: "either" }]])(
    "with no role chosen (%o) selects none, asks for one, and saves nothing until then",
    async (preferences) => {
      const { api, onSubmit, calls } = setup(0, { preferences });
      await screen.findByText(/Choose one/);
      expect(screen.getByRole("radio", { name: "A man" }).getAttribute("aria-checked")).toBe("false");
      expect(screen.getByRole("radio", { name: "A woman" }).getAttribute("aria-checked")).toBe("false");

      fireEvent.click(screen.getByRole("radio", { name: /Hello/ }));
      const save = screen.getByText("Save settings");
      expect(save.disabled).toBe(true);
      fireEvent.click(save);
      expect(api.saveUserPreferences).not.toHaveBeenCalled();
      expect(onSubmit).not.toHaveBeenCalled();

      // Picking one saves it, before the situation.
      fireEvent.click(screen.getByRole("radio", { name: "A woman" }));
      expect(screen.queryByText(/Choose one/)).toBeNull();
      fireEvent.click(screen.getByText("Save settings"));
      expect(api.saveUserPreferences).toHaveBeenCalledWith(
        { audio_lesson_character: "woman" },
        expect.any(Function),
        expect.any(Function),
      );
      expect(calls).toEqual(["preferences", "situation"]);
    },
  );

  it("with no role chosen, picking one alone is a change to save", async () => {
    const { api } = setup(0, { initialType: "situation", initialSuggestion: "at a café", preferences: {} });
    await screen.findByText(/Choose one/);
    expect(screen.queryByText("Save settings")).toBeNull();
    fireEvent.click(screen.getByRole("radio", { name: "A man" }));
    fireEvent.click(screen.getByText("Save settings"));
    expect(api.saveUserPreferences).toHaveBeenCalledWith(
      { audio_lesson_character: "man" },
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("says so when the role could not be saved, and goes no further", async () => {
    const { onSubmit, onDismiss } = setup(0, { preferences: {}, saveFails: true });
    await screen.findByText("In the dialogues you speak as");
    fireEvent.click(screen.getByRole("radio", { name: "A woman" }));
    fireEvent.click(screen.getByText("Save settings"));
    expect(screen.getByRole("alert").textContent).toMatch(/Could not save/);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it.each([0, 1])(
    "shows no lesson length or time to answer at level %i: they are in Settings > Audio lessons",
    (level) => {
      setup(level, {
        preferences: { audio_lesson_character: "man", audio_lesson_minutes: "10", audio_lesson_answer_time: "0" },
      });
      expect(screen.queryByRole("slider")).toBeNull();
      expect(screen.queryByText(/Time to answer|Lesson length/)).toBeNull();
    },
  );
});
