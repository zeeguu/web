import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SPEED_OPTIONS, parseStoredSpeed } from "../../src/components/audioSpeeds";
import { SpeedPicker } from "../../src/components/CustomAudioPlayer";

/**
 * Audio lesson playback speed: the options on offer, and reading back the one a
 * learner chose last time for a language.
 */
describe("parseStoredSpeed", () => {
  it("reads back every speed on offer, including the ones above 1x", () => {
    for (const speed of SPEED_OPTIONS) {
      expect(parseStoredSpeed(String(speed))).toBe(speed);
    }
  });

  it("falls back to 1x for nothing stored, junk, or a speed no longer offered", () => {
    expect(parseStoredSpeed(null)).toBe(1);
    expect(parseStoredSpeed("abc")).toBe(1);
    expect(parseStoredSpeed("3")).toBe(1);
  });
});

describe("SpeedPicker", () => {
  it("offers speeds both below and above 1x, with the current one selected", async () => {
    render(<SpeedPicker value={1} onChange={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: /Playback speed/ }));

    const items = screen.getAllByRole("menuitem");
    expect(items.map((i) => i.textContent)).toEqual(SPEED_OPTIONS.map((s) => `${s}x`));
    expect(screen.getByRole("menuitem", { name: "1x" })).toHaveClass("Mui-selected");
  });

  it("any speed is one pick away from 1x, slower or faster", async () => {
    const onChange = vi.fn();
    render(<SpeedPicker value={1} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: /Playback speed/ }));
    await userEvent.click(screen.getByRole("menuitem", { name: "0.8x" }));
    expect(onChange).toHaveBeenLastCalledWith(0.8);

    await userEvent.click(screen.getByRole("button", { name: /Playback speed/ }));
    await userEvent.click(screen.getByRole("menuitem", { name: "1.5x" }));
    expect(onChange).toHaveBeenLastCalledWith(1.5);
  });

  it("doesn't open while disabled", async () => {
    render(<SpeedPicker value={1} onChange={() => {}} disabled />);
    await userEvent.click(screen.getByRole("button", { name: /Playback speed/ }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
