import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import LanguageStreakBar from "../../src/components/LanguageStreakBar";
import { APIContext } from "../../src/contexts/APIContext";
import { UserContext } from "../../src/contexts/UserContext";

/**
 * A language switch is applied only once the server has saved it, so the bar
 * says it is working on it -- but only when the save is slow enough to notice.
 */
describe("LanguageStreakBar while switching", () => {
  afterEach(() => vi.useRealTimers());

  function renderBar() {
    const saves = [];
    const api = {
      getAllLanguageStreaks: (cb) =>
        cb([
          { code: "da", language: "Danish", daily_streak: 1, practiced_today: false },
          { code: "bg", language: "Bulgarian", daily_streak: 1, practiced_today: true },
        ]),
      saveUserDetails: (details, onError, onSuccess) => saves.push({ onError, onSuccess }),
      getUserDetails: () => new Promise(() => {}),
    };
    const userDetails = { learned_language: "da" };
    render(
      <MemoryRouter initialEntries={["/practice"]}>
        <APIContext.Provider value={api}>
          <UserContext.Provider value={{ userDetails, setUserDetails: () => {} }}>
            <LanguageStreakBar />
          </UserContext.Provider>
        </APIContext.Provider>
      </MemoryRouter>,
    );
    return saves;
  }

  it("shows no spinner when the save is quick", () => {
    vi.useFakeTimers();
    const saves = renderBar();

    fireEvent.click(screen.getByTitle("Bulgarian"));
    act(() => vi.advanceTimersByTime(100));
    act(() => saves[0].onError());
    act(() => vi.advanceTimersByTime(1000));

    expect(screen.queryByRole("status")).toBeNull();
  });

  it("puts a spinner in the chosen flag's place while the server is slow", () => {
    vi.useFakeTimers();
    const saves = renderBar();

    fireEvent.click(screen.getByTitle("Bulgarian"));
    expect(screen.queryByRole("status")).toBeNull();
    act(() => vi.advanceTimersByTime(400));

    expect(screen.getByRole("status")).toHaveAccessibleName("Switching to Bulgarian");
    expect(screen.queryByAltText("Bulgarian")).toBeNull();
    expect(screen.getByAltText("Danish")).toBeTruthy();

    act(() => saves[0].onError());
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByAltText("Bulgarian")).toBeTruthy();
  });
});
