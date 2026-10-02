import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SPEED_OPTIONS } from "../../src/components/audioSpeeds";
import SpeedPicker from "../../src/components/SpeedPicker";

/** The speed pill in the audio player, and the menu it opens. */
describe("SpeedPicker", () => {
  const pill = () => screen.getByRole("button", { name: /Playback speed/ });

  it("offers speeds both below and above 1x, with the current one selected", async () => {
    render(<SpeedPicker value={1} onChange={() => {}} />);
    await userEvent.click(pill());

    const items = screen.getAllByRole("menuitem");
    expect(items.map((i) => i.textContent)).toEqual(SPEED_OPTIONS.map((s) => `${s}x`));
    expect(screen.getByRole("menuitem", { name: "1x" })).toHaveClass("Mui-selected");
  });

  it("any speed is one pick away from 1x, slower or faster", async () => {
    // The tap-to-cycle pill this replaced needed four taps (through 1.1-1.5x)
    // to get from 1x to anything slower.
    const onChange = vi.fn();
    render(<SpeedPicker value={1} onChange={onChange} />);

    await userEvent.click(pill());
    await userEvent.click(screen.getByRole("menuitem", { name: "0.8x" }));
    expect(onChange).toHaveBeenLastCalledWith(0.8);

    await userEvent.click(pill());
    await userEvent.click(screen.getByRole("menuitem", { name: "1.5x" }));
    expect(onChange).toHaveBeenLastCalledWith(1.5);
  });

  it("closes once a speed is picked", async () => {
    render(<SpeedPicker value={1} onChange={() => {}} />);
    await userEvent.click(pill());
    await userEvent.click(screen.getByRole("menuitem", { name: "0.9x" }));
    await vi.waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("is disabled while the audio loads", () => {
    render(<SpeedPicker value={1} onChange={() => {}} disabled />);
    expect(pill()).toBeDisabled();
  });
});

describe("SpeedPicker accessibility", () => {
  it("says whether its menu is open, and which menu it controls", async () => {
    render(<SpeedPicker value={1} onChange={() => {}} />);
    const pill = screen.getByRole("button", { name: /Playback speed/ });
    expect(pill).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(pill);
    expect(pill).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu").closest("[id]")).toBeTruthy();
    expect(document.getElementById(pill.getAttribute("aria-controls"))).toBeInTheDocument();
  });
});
