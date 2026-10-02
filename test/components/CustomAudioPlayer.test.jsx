import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LocalStorage from "../../src/assorted/LocalStorage";
import CustomAudioPlayer from "../../src/components/CustomAudioPlayer";

/**
 * The audio lesson player remembers a speed per learned language. The language
 * comes from user details, which can arrive after the player has mounted.
 */
describe("CustomAudioPlayer speed", () => {
  let store;
  beforeEach(() => {
    // jsdom has no matchMedia; the player checks it for PWA display mode.
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    store = new Map([["es", "1.25"]]);
    vi.spyOn(LocalStorage, "getAudioSpeed").mockImplementation((lang) => store.get(lang) ?? null);
    vi.spyOn(LocalStorage, "setAudioSpeed").mockImplementation((lang, speed) => store.set(lang, String(speed)));
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const pill = () => screen.getByRole("button", { name: /Playback speed/ });

  // The pill is disabled until the audio reports it can play.
  function ready(container) {
    fireEvent(container.querySelector("audio"), new Event("loadedmetadata"));
    fireEvent(container.querySelector("audio"), new Event("canplay"));
  }

  it("loads the saved speed once the language arrives", () => {
    const { rerender } = render(<CustomAudioPlayer src="a.mp3" />);
    expect(pill()).toHaveTextContent("1x");
    rerender(<CustomAudioPlayer src="a.mp3" language="es" />);
    expect(pill()).toHaveTextContent("1.25x");
  });

  it("a speed picked before the language arrived is kept, and saved for it", async () => {
    const { container, rerender } = render(<CustomAudioPlayer src="a.mp3" />);
    ready(container);
    await userEvent.click(pill());
    await userEvent.click(screen.getByRole("menuitem", { name: "1.5x" }));

    rerender(<CustomAudioPlayer src="a.mp3" language="es" />);
    expect(pill()).toHaveTextContent("1.5x");
    expect(store.get("es")).toBe("1.5");
  });

  it("puts the chosen speed back if the element resets it on play", () => {
    const { container } = render(<CustomAudioPlayer src="a.mp3" language="es" />);
    const audio = container.querySelector("audio");
    audio.playbackRate = 1; // what some WebViews do on load/play
    fireEvent(audio, new Event("play"));
    expect(audio.playbackRate).toBe(1.25);
    expect(pill()).toHaveTextContent("1.25x");
  });
});
