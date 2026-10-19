import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { UserContext } from "../../src/contexts/UserContext";
import DailyLessonSettingsDialog from "../../src/dailyAudio/DailyLessonSettingsDialog";

/**
 * At A0 every daily lesson is a situation, so the dialog offers no other type.
 */
function setup(level, { initialType = null, initialSuggestion = "" } = {}) {
  const api = { checkDailyLessonFeasibility: vi.fn((ok) => ok({ feasible: true })) };
  const onSubmit = vi.fn();
  render(
    <UserContext.Provider value={{ userDetails: { learned_language: "da", da_cefr_level: level } }}>
      <DailyLessonSettingsDialog
        api={api}
        initialType={initialType}
        initialSuggestion={initialSuggestion}
        alreadySubscribed={false}
        onSubmit={onSubmit}
        onDismiss={() => {}}
      />
    </UserContext.Provider>,
  );
  return { api, onSubmit };
}

describe("DailyLessonSettingsDialog", () => {
  it("offers all three types above A0", () => {
    setup(1);
    expect(screen.getAllByRole("radio").map((r) => r.textContent)).toEqual(["Vocabulary", "Topic", "Situation"]);
    expect(screen.getByText("Daily lesson type")).toBeTruthy();
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
});
