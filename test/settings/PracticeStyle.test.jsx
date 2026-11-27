import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { APIContext } from "../../src/contexts/APIContext";
import { UserContext } from "../../src/contexts/UserContext";
import SessionStorage from "../../src/assorted/SessionStorage";
import PracticeStyle from "../../src/pages/Settings/Pages/PracticeStyle";

describe("PracticeStyle", () => {
  beforeEach(() => {
    SessionStorage.setAudioExercisesEnabled(true);
  });

  function renderPage(initialPreferences = {}, saveImpl = (_prefs, onSuccess) => onSuccess?.()) {
    const api = {
      getUserPreferences: vi.fn().mockResolvedValue(initialPreferences),
      saveUserPreferences: vi.fn(saveImpl),
    };
    const setUserPreferences = vi.fn();

    render(
      <MemoryRouter>
        <APIContext.Provider value={api}>
          <UserContext.Provider value={{ session: "test-session", userPreferences: initialPreferences, setUserPreferences }}>
            <PracticeStyle />
          </UserContext.Provider>
        </APIContext.Provider>
      </MemoryRouter>,
    );

    return { api, setUserPreferences };
  }

  it("loads vary_exercise_contexts as off by default and saves when toggled", async () => {
    const user = userEvent.setup();
    const { api } = renderPage({});

    const toggle = await screen.findByRole("checkbox", { name: /vary example sentences/i });
    expect(toggle.checked).toBe(false);

    await user.click(toggle);
    expect(toggle.checked).toBe(true);
    expect(api.saveUserPreferences).toHaveBeenCalledWith(
      { vary_exercise_contexts: "true" },
      expect.any(Function),
      expect.any(Function),
    );

    await user.click(toggle);
    expect(toggle.checked).toBe(false);
    expect(api.saveUserPreferences).toHaveBeenLastCalledWith(
      { vary_exercise_contexts: "false" },
      expect.any(Function),
      expect.any(Function),
    );
  });

  it("reverts the toggle when saving fails", async () => {
    const user = userEvent.setup();
    renderPage({ vary_exercise_contexts: "false" }, (_prefs, _onSuccess, onError) => onError?.());

    const toggle = await screen.findByRole("checkbox", { name: /vary example sentences/i });
    expect(toggle.checked).toBe(false);

    await user.click(toggle);
    await waitFor(() => expect(toggle.checked).toBe(false));
  });

  it("reflects stored preference from the API", async () => {
    renderPage({ vary_exercise_contexts: "true", audio_exercises: "false" });

    const varyToggle = await screen.findByRole("checkbox", { name: /vary example sentences/i });
    const audioToggle = await screen.findByRole("checkbox", { name: /include audio exercises/i });

    await waitFor(() => {
      expect(varyToggle.checked).toBe(true);
      expect(audioToggle.checked).toBe(false);
    });
  });
});
