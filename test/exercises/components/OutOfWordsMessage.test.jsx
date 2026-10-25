import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import OutOfWordsMessage from "../../../src/exercises/OutOfWordsMessage";
import { APIContext } from "../../../src/contexts/APIContext";
import { UserContext } from "../../../src/contexts/UserContext";
import LocalStorage from "../../../src/assorted/LocalStorage";

/**
 * Which message a learner with nothing left to practise sees. The words are
 * counted in the learned language: a learner who just added Bulgarian, with
 * Danish words saved, was congratulated for practising everything due.
 */
describe("OutOfWordsMessage", () => {
  // Stubbed: newer Node ships its own global localStorage, which shadows jsdom's.
  beforeEach(() => vi.spyOn(LocalStorage, "getLanguageNames").mockReturnValue({ bg: "Bulgarian" }));

  function renderWith(countResult, waitingWords = []) {
    const api = {
      getCountOfAllScheduledUserWords: (callback, options) => {
        if (countResult === "error") options.onError(new Error("network"));
        else callback(countResult);
      },
      getUserWordsNextInLearning: (callback, options) => {
        if (waitingWords === "error") options.onError(new Error("network"));
        else callback(waitingWords);
      },
    };
    render(
      <MemoryRouter>
        <APIContext.Provider value={api}>
          <UserContext.Provider value={{ userDetails: { learned_language: "bg" } }}>
            <OutOfWordsMessage />
          </UserContext.Provider>
        </APIContext.Provider>
      </MemoryRouter>,
    );
  }

  it("says there are no words yet in a language with none scheduled", () => {
    renderWith(0);
    expect(screen.getByText(/No words to practice in Bulgarian yet/)).toBeTruthy();
    expect(screen.getByText(/audio lessons/)).toBeTruthy();
  });

  it("says everything due is practised when the language has words", () => {
    renderWith(12);
    expect(screen.getByText(/practiced all the words due/)).toBeTruthy();
  });

  it("falls back to the 'all practiced' message when the count fails", () => {
    renderWith("error");
    expect(screen.getByText(/practiced all the words due/)).toBeTruthy();
  });

  // A learner whose exercises are full translated words that never showed up,
  // and took the "all practiced" screen to mean they had been lost.
  it("says new words are waiting when translated words sit outside full exercises", () => {
    renderWith(21, [{ id: 1 }]);
    expect(screen.getByText(/new words are waiting/)).toBeTruthy();
    expect(screen.getByRole("link", { name: /more words at a time/ }).getAttribute("href")).toBe(
      "/account_settings/exercise_scheduling",
    );
  });

  it("does not mention waiting words when that request fails", () => {
    renderWith(21, "error");
    expect(screen.getByText(/spaced-repetition principles/)).toBeTruthy();
  });
});
