import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DailyLessonSettingsPill from "../../src/dailyAudio/DailyLessonSettingsPill";

describe("DailyLessonSettingsPill", () => {
  it("names a situation from the A0 list with its emoji", () => {
    render(<DailyLessonSettingsPill subject="ordering at a café" a0 />);
    expect(screen.getByRole("button").textContent).toBe("☕ At the café");
    expect(screen.getByRole("button").getAttribute("aria-label")).toBe("Daily lesson settings: ☕ At the café");
  });

  it("shows a topic above A0 as typed, even when it matches an A0 situation", () => {
    render(<DailyLessonSettingsPill subject="asking the time" />);
    expect(screen.getByRole("button").textContent).toBe("asking the time");
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
