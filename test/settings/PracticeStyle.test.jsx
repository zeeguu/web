import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { APIContext } from "../../src/contexts/APIContext";
import { UserContext } from "../../src/contexts/UserContext";
import SessionStorage from "../../src/assorted/SessionStorage";
import PracticeStyle from "../../src/pages/Settings/Pages/PracticeStyle";
import Zeeguu_API from "../../src/api/Zeeguu_API";

describe("PracticeStyle", () => {
  beforeEach(() => {
    sessionStorage.removeItem(SessionStorage.Keys.AudioExercisesEnabled);
  });

  function renderPage({
    userDetails = { learned_language: "da", native_language: "en" },
    contextPreferences = {},
    apiPreferences = contextPreferences,
    getUserPreferencesImpl,
    saveImpl = (_prefs, onSuccess) => onSuccess?.(),
  } = {}) {
    let cachedPrefs = { ...contextPreferences };
    const api = {
      getUserPreferences: vi.fn(getUserPreferencesImpl || (() => Promise.resolve(apiPreferences))),
      saveUserPreferences: vi.fn(saveImpl),
    };
    const setUserPreferences = vi.fn((updater) => {
      cachedPrefs = typeof updater === "function" ? updater(cachedPrefs) : updater;
    });

    const utils = render(
      <MemoryRouter>
        <APIContext.Provider value={api}>
          <UserContext.Provider
            value={{
              session: "test-session",
              userDetails,
              userPreferences: contextPreferences,
              setUserPreferences,
            }}
          >
            <PracticeStyle />
          </UserContext.Provider>
        </APIContext.Provider>
      </MemoryRouter>,
    );

    return { api, setUserPreferences, getCachedPrefs: () => cachedPrefs, unmount: utils.unmount };
  }

  it("hides Example sentences when the API does not return vary_exercise_contexts", async () => {
    renderPage({ contextPreferences: {}, apiPreferences: { audio_exercises: "true" } });

    const audioToggle = await screen.findByRole("checkbox", { name: /include audio exercises/i });
    expect(audioToggle.checked).toBe(true);
    expect(screen.queryByRole("checkbox", { name: /vary example sentences/i })).toBeNull();
  });

  it("shows audio exercises as ON on a fresh tab when SessionStorage is unset", async () => {
    expect(SessionStorage.getAudioExercisesEnabled()).toBeUndefined();
    renderPage({ contextPreferences: {}, apiPreferences: { audio_exercises: "true", vary_exercise_contexts: "false" } });

    const audioToggle = await screen.findByRole("checkbox", { name: /^include audio exercises/i });
    expect(audioToggle.checked).toBe(true);
    expect(screen.queryByText(/temporarily disabled/i)).toBeNull();
  });

  it("distinguishes temporary session disable from permanently disabling audio", async () => {
    const user = userEvent.setup();
    SessionStorage.setAudioExercisesEnabled(false);

    const { api } = renderPage({
      contextPreferences: { audio_exercises: "true", vary_exercise_contexts: "false" },
    });

    // Server ON + session disabled => shows Temporarily disabled
    const audioToggle = await screen.findByRole("checkbox", { name: /temporarily disabled/i });
    expect(audioToggle.checked).toBe(false);

    // Re-enabling clears temporary disable
    await user.click(audioToggle);
    expect(audioToggle.checked).toBe(true);
    expect(screen.queryByText(/temporarily disabled/i)).toBeNull();
    expect(SessionStorage.getAudioExercisesEnabled()).toBe("true");

    // Permanently disabling does NOT label it Temporarily disabled
    await user.click(audioToggle);
    expect(audioToggle.checked).toBe(false);
    expect(screen.queryByText(/temporarily disabled/i)).toBeNull();
    expect(api.saveUserPreferences).toHaveBeenLastCalledWith(
      { audio_exercises: "false" },
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("hydrates preferences from the API when UserContext is stale", async () => {
    renderPage({
      contextPreferences: { audio_exercises: "true" },
      apiPreferences: { vary_exercise_contexts: "true", audio_exercises: "false" },
    });

    const varyToggle = await screen.findByRole("checkbox", { name: /vary example sentences/i });
    const audioToggle = await screen.findByRole("checkbox", { name: /include audio exercises/i });

    await waitFor(() => {
      expect(varyToggle.checked).toBe(true);
      expect(audioToggle.checked).toBe(false);
    });
  });

  it("does not let a slow initial GET overwrite a toggle clicked by the user", async () => {
    const user = userEvent.setup();
    let resolveGet;
    const { api } = renderPage({
      contextPreferences: { vary_exercise_contexts: "false", audio_exercises: "true" },
      getUserPreferencesImpl: () => new Promise((resolve) => { resolveGet = resolve; }),
    });

    const varyToggle = await screen.findByRole("checkbox", { name: /vary example sentences/i });
    expect(varyToggle.checked).toBe(false);

    await user.click(varyToggle);
    expect(varyToggle.checked).toBe(true);

    // Now the stale initial GET resolves with "false"
    resolveGet({ vary_exercise_contexts: "false", audio_exercises: "true" });
    await waitFor(() => expect(api.getUserPreferences).toHaveBeenCalled());
    expect(varyToggle.checked).toBe(true);
  });

  it("ignores older out-of-order save failures and shows an error on latest failure", async () => {
    const user = userEvent.setup();
    const callbacks = [];
    renderPage({
      contextPreferences: { vary_exercise_contexts: "false" },
      saveImpl: (_prefs, onSuccess, onError) => {
        callbacks.push({ onSuccess, onError });
      },
    });

    const toggle = await screen.findByRole("checkbox", { name: /vary example sentences/i });
    await user.click(toggle); // #1: true
    await user.click(toggle); // #2: false
    await user.click(toggle); // #3: true
    expect(toggle.checked).toBe(true);

    // Out-of-order failure of #1 must NOT revert #3
    callbacks[0].onError();
    expect(toggle.checked).toBe(true);
    expect(screen.queryByText(/couldn't save/i)).toBeNull();

    // Failure of latest (#3) reverts to server-confirmed "false" and shows error
    callbacks[2].onError();
    await waitFor(() => expect(toggle.checked).toBe(false));
    expect(screen.getByText(/couldn't save/i)).toBeTruthy();
  });

  it("double-toggling while offline reverts to the server-confirmed value, even after unmount", async () => {
    const user = userEvent.setup();
    const callbacks = [];
    const { getCachedPrefs, unmount } = renderPage({
      contextPreferences: { vary_exercise_contexts: "false" },
      saveImpl: (_prefs, onSuccess, onError) => {
        callbacks.push({ onSuccess, onError });
      },
    });

    const toggle = await screen.findByRole("checkbox", { name: /vary example sentences/i });
    await user.click(toggle); // #1: true (unconfirmed)
    await user.click(toggle); // #2: false (unconfirmed)
    unmount();

    callbacks[0].onError();
    callbacks[1].onError();
    expect(getCachedPrefs().vary_exercise_contexts).toBe("false");
  });

  it("handles initial getUserPreferences rejection gracefully", async () => {
    renderPage({
      contextPreferences: { vary_exercise_contexts: "true" },
      getUserPreferencesImpl: () => Promise.reject(new Error("offline")),
    });

    const toggle = await screen.findByRole("checkbox", { name: /vary example sentences/i });
    expect(toggle.checked).toBe(true);
  });

  it("toggles practice formats, keeps at least one on, and uses Typing exercises for both sentences and flashcards", async () => {
    const user = userEvent.setup();
    const { api } = renderPage({
      contextPreferences: {
        exercise_families: "multiple_choice,typing,flashcards_meaning",
        flashcard_self_grade: "false",
      },
    });

    const sentencesToggle = await screen.findByRole("checkbox", { name: /in sentences/i });
    const meaningToggle = screen.getByRole("checkbox", { name: /word → meaning/i });
    const typingToggle = screen.getByRole("checkbox", { name: /typing exercises/i });
    expect(screen.getByText("DA → EN")).toBeTruthy();
    expect(screen.getByText("EN → DA")).toBeTruthy();
    expect(sentencesToggle.checked).toBe(true);
    expect(meaningToggle.checked).toBe(true);
    expect(typingToggle.checked).toBe(true);

    // Turning off Typing disables sentence typing AND turns on flip flashcards in one save
    await user.click(typingToggle);
    expect(typingToggle.checked).toBe(false);
    expect(api.saveUserPreferences).toHaveBeenLastCalledWith(
      { exercise_families: "multiple_choice,flashcards_meaning", flashcard_self_grade: "true" },
      expect.any(Function),
      expect.any(Function),
    );

    // Turn off In sentences -> only flashcards_meaning left (still tap-to-flip)
    await user.click(sentencesToggle);
    expect(sentencesToggle.checked).toBe(false);
    expect(api.saveUserPreferences).toHaveBeenLastCalledWith(
      { exercise_families: "flashcards_meaning", flashcard_self_grade: "true" },
      expect.any(Function),
      expect.any(Function),
    );
    expect(screen.getByText(/at least one practice format must stay on/i)).toBeTruthy();

    // Trying to turn off the last remaining format is a no-op
    const callsBefore = api.saveUserPreferences.mock.calls.length;
    await user.click(meaningToggle);
    expect(meaningToggle.checked).toBe(true);
    expect(api.saveUserPreferences.mock.calls.length).toBe(callsBefore);
  });
});

describe("fetchAndSortContexts deduplication", () => {
  it("omits the current sentence by bookmark_id/text without colliding on ExampleSentence.id", async () => {
    const api = new Zeeguu_API("http://test");
    api.getPastContexts = vi.fn().mockResolvedValue({
      past_contexts: [
        { bookmark_id: 10, context: "Der Hund bellt.", bookmark: { id: 10 } },
        { bookmark_id: 11, context: "Der Hund spielt im Park.", bookmark: { id: 11 } },
      ],
    });
    api.getAlternativeSentences = vi.fn().mockResolvedValue({
      examples: [
        // Same text as current: dropped
        { id: 20, sentence: "der hund bellt." },
        // ExampleSentence.id === exerciseBookmark.id (10), different sentence: MUST stay
        { id: 10, sentence: "Der Hund schläft.", bookmark: { id: 999 } },
      ],
    });

    const items = await api.fetchAndSortContexts({
      id: 10,
      user_word_id: 99,
      context: "Der Hund bellt.",
    });

    expect(items).toHaveLength(3);
    expect(items[0]).toEqual({
      isCurrent: true,
      bookmark: { id: 10, user_word_id: 99, context: "Der Hund bellt." },
    });
    expect(items.slice(1).map((x) => x.sentence || x.context)).toEqual([
      "Der Hund spielt im Park.",
      "Der Hund schläft.",
    ]);
  });
});
