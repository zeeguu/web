import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DailyLessonSettingsPill from "../../src/dailyAudio/DailyLessonSettingsPill";

describe("DailyLessonSettingsPill", () => {
  it("says Next lesson settings, and names a situation from the A0 list with its emoji in its label", () => {
    render(<DailyLessonSettingsPill subject="ordering at a café" a0 />);
    expect(screen.getByRole("button").textContent).toBe("Next lesson settings");
    expect(screen.getByRole("button").getAttribute("aria-label")).toBe("Next lesson settings: ☕ At the café");
  });

  it("names a topic above A0 as typed, even when it matches an A0 situation", () => {
    render(<DailyLessonSettingsPill subject="asking the time" />);
    expect(screen.getByRole("button").getAttribute("aria-label")).toBe("Next lesson settings: asking the time");
  });

  it("says Next lesson settings without a subject", () => {
    render(<DailyLessonSettingsPill subject={null} />);
    expect(screen.getByRole("button").textContent).toBe("Next lesson settings");
    expect(screen.getByRole("button").getAttribute("aria-label")).toBe("Next lesson settings");
  });
});
