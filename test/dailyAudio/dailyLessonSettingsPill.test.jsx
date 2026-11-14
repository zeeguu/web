import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DailyLessonSettingsPill from "../../src/dailyAudio/DailyLessonSettingsPill";

describe("DailyLessonSettingsPill", () => {
  it("names a situation from the A0 list with its emoji", () => {
    render(<DailyLessonSettingsPill subject="ordering at a café" />);
    expect(screen.getByRole("button").textContent).toBe("☕ At the café");
  });

  it("names a typed topic as typed", () => {
    render(<DailyLessonSettingsPill subject="Less is more" />);
    expect(screen.getByRole("button").textContent).toBe("Less is more");
  });

  it("says Daily lesson settings without a subject", () => {
    render(<DailyLessonSettingsPill subject={null} />);
    expect(screen.getByRole("button").textContent).toBe("Daily lesson settings");
  });
});
