import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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

  function renderWith(countResult) {
    const api = {
      getCountOfAllScheduledUserWords: (callback, options) => {
        if (countResult === "error") options.onError(new Error("network"));
        else callback(countResult);
      },
    };
    render(
      <APIContext.Provider value={api}>
        <UserContext.Provider value={{ userDetails: { learned_language: "bg" } }}>
          <OutOfWordsMessage />
        </UserContext.Provider>
      </APIContext.Provider>,
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
});
