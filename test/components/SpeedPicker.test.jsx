import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SPEED_PRESETS } from "../../src/components/audioSpeeds";
import SpeedPicker from "../../src/components/SpeedPicker";

/** The speed pill in the audio player, and the panel it opens. */
describe("SpeedPicker", () => {
  // hidden: an open popover aria-hides the rest of the page, the pill included.
  const pill = () => screen.getByRole("button", { name: /Playback speed/, hidden: true });
  const open = (props) => {
    render(<SpeedPicker value={1} onChange={() => {}} {...props} />);
    return userEvent.click(pill());
  };

  it("shows the exact speed and offers presets both below and above 1x", async () => {
    await open({ value: 0.85 });
    expect(screen.getByText("0.85x", { selector: "div" })).toBeInTheDocument();
    for (const speed of SPEED_PRESETS) {
      expect(screen.getByRole("button", { name: `${speed}x` })).toBeInTheDocument();
    }
  });

  it("marks the current preset as selected", async () => {
    await open({ value: 1.25 });
    expect(screen.getByRole("button", { name: "1.25x" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "1x" })).toHaveAttribute("aria-pressed", "false");
  });

  it("any preset is one tap away, slower or faster", async () => {
    const onChange = vi.fn();
    await open({ onChange });
    await userEvent.click(screen.getByRole("button", { name: "0.8x" }));
    expect(onChange).toHaveBeenLastCalledWith(0.8);
    await userEvent.click(screen.getByRole("button", { name: "1.5x" }));
    expect(onChange).toHaveBeenLastCalledWith(1.5);
  });

  it("- and + move by 0.05 without float noise", async () => {
    const onChange = vi.fn();
    await open({ value: 0.85, onChange });
    await userEvent.click(screen.getByRole("button", { name: "Slower" }));
    expect(onChange).toHaveBeenLastCalledWith(0.8);
    await userEvent.click(screen.getByRole("button", { name: "Faster" }));
    expect(onChange).toHaveBeenLastCalledWith(0.9);
  });

  it("disables - at the slowest and + at the fastest", async () => {
    await open({ value: 0.8 });
    expect(screen.getByRole("button", { name: "Slower" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Faster" })).toBeEnabled();
  });

  it("stays open after a change, so the learner can keep adjusting", async () => {
    await open();
    await userEvent.click(screen.getByRole("button", { name: "0.9x" }));
    expect(screen.getByRole("button", { name: "Slower" })).toBeInTheDocument();
  });

  it("is disabled while the audio loads", () => {
    render(<SpeedPicker value={1} onChange={() => {}} disabled />);
    expect(pill()).toBeDisabled();
  });

  it("says whether its panel is open, and which one it controls", async () => {
    render(<SpeedPicker value={1} onChange={() => {}} />);
    expect(pill()).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(pill());
    expect(pill()).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById(pill().getAttribute("aria-controls"))).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Playback speed" })).toBeInTheDocument();
  });
});
