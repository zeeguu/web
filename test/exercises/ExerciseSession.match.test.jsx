import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import ExerciseSession from "../../src/exercises/ExerciseSession";
import Match from "../../src/exercises/exerciseTypes/match/Match";
import { APIContext } from "../../src/contexts/APIContext";
import { SpeechContext } from "../../src/contexts/SpeechContext";
import { UserContext } from "../../src/contexts/UserContext";
import { ExercisesCounterContext } from "../../src/exercises/ExercisesCounterContext";

const bookmark = (id, from, to) => ({
  id,
  user_word_id: id,
  from,
  to,
  context: `context ${id}`,
  context_tokenized: [],
});
const FIRST = [bookmark(1, "hund", "dog"), bookmark(2, "kat", "cat"), bookmark(3, "ko", "cow")];
const SECOND = [bookmark(4, "hest", "horse"), bookmark(5, "gris", "pig"), bookmark(6, "fisk", "fish")];

vi.mock("../../src/exercises/assignBookmarksToExercises", () => ({
  assignBookmarksToExercises: vi.fn(),
  assignBookmarksToA0Exercises: vi.fn(),
  sprinkleRecallTests: (exercises) => exercises,
}));
vi.mock("../../src/contexts/FeedbackContext", () => ({
  useFeedbackContext: () => ({ setContextualInfo: () => {} }),
}));
vi.mock("../../src/hooks/useExerciseSession", () => ({
  default: () => ({
    exerciseSessionId: 1,
    getExerciseSessionId: () => 1,
    sessionDuration: 0,
    isTimerActive: false,
  }),
}));
vi.mock("../../src/exercises/exerciseTypes/SolutionFeedbackLinks", () => ({
  default: () => <div>links</div>,
}));

const api = {
  logUserActivity: () => {},
  uploadExerciseFinalizedData: () => {},
  getBookmarksRecommendedForPractice: (callback) => callback([...FIRST, ...SECOND]),
  getCountOfBookmarksRecommendedForPractice: (callback) => callback(0),
};
const speech = { stopAudio: () => {}, speakOut: async () => {} };

function renderSession() {
  return render(
    <>
      <MemoryRouter initialEntries={["/practice"]}>
        <APIContext.Provider value={api}>
          <SpeechContext.Provider value={speech}>
            <UserContext.Provider value={{ userDetails: { learned_language: "da" }, userPreferences: {} }}>
              <ExercisesCounterContext.Provider
                value={{
                  hasExerciseNotification: false,
                  decrementExerciseCounter: () => {},
                  hideExerciseCounter: () => {},
                }}
              >
                <Route path="/practice" exact>
                  <ExerciseSession />
                </Route>
                <Route path="/practice/summary">session summary</Route>
              </ExercisesCounterContext.Provider>
            </UserContext.Provider>
          </SpeechContext.Provider>
        </APIContext.Provider>
      </MemoryRouter>
    </>,
  );
}

// Solves the first two pairs; Match reveals the third by itself.
function solve(bookmarks) {
  for (const b of bookmarks.slice(0, 2)) {
    fireEvent.click(screen.getByText(b.from));
    fireEvent.click(screen.getByText(b.to));
  }
}

const nextButton = () => screen.findByRole("button", { name: /next/i }, { timeout: 2000 });

describe("ExerciseSession with Match", () => {
  beforeEach(async () => {
    // Node's own localStorage has no setItem and refuses assignment.
    vi.stubGlobal("localStorage", { getItem: () => null, setItem: () => {}, removeItem: () => {} });
    const { assignBookmarksToExercises } = await import("../../src/exercises/assignBookmarksToExercises");
    assignBookmarksToExercises.mockReturnValue([
      { type: Match, bookmarks: FIRST },
      { type: Match, bookmarks: SECOND },
    ]);
  });

  it("offers Next after the last pair, and reaches the summary", async () => {
    renderSession();

    solve(FIRST);
    fireEvent.click(await nextButton());

    await screen.findByText("hest");
    solve(SECOND);
    fireEvent.click(await nextButton());

    await waitFor(() => expect(screen.getByText("session summary")).toBeInTheDocument());
  });

  it("shows the exercise links while the pairs are still open", async () => {
    renderSession();
    await screen.findByText("hund");
    expect(await screen.findByText("links")).toBeInTheDocument();
  });
});
