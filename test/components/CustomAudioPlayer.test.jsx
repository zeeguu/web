import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import LocalStorage from "../../src/assorted/LocalStorage";
import CustomAudioPlayer from "../../src/components/CustomAudioPlayer";

/**
 * The audio lesson player remembers a speed per learned language.
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


  it("starts at the speed saved for the language", () => {
    render(<CustomAudioPlayer src="a.mp3" language="es" />);
    expect(pill()).toHaveTextContent("1.25x");
  });

  it("puts the chosen speed back if the element resets it on play", () => {
    const { container } = render(<CustomAudioPlayer src="a.mp3" language="es" />);
    const audio = container.querySelector("audio");
    audio.playbackRate = 1; // what some WebViews do on load/play
    audio.defaultPlaybackRate = 1;
    fireEvent(audio, new Event("play"));
    expect(audio.playbackRate).toBe(1.25);
    expect(audio.defaultPlaybackRate).toBe(1.25);
    expect(pill()).toHaveTextContent("1.25x");
  });
});
