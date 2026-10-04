import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";

import LocalStorage from "../../src/assorted/LocalStorage";
import CustomAudioPlayer from "../../src/components/CustomAudioPlayer";

/**
 * Headset and lock-screen play/pause go through navigator.mediaSession. A
 * learner reported that after pausing from the headset, play did nothing.
 */
describe("CustomAudioPlayer media controls", () => {
  let handlers;
  let session;

  beforeEach(() => {
    handlers = {};
    session = {
      metadata: null,
      playbackState: "none",
      setActionHandler: (action, fn) => (handlers[action] = fn),
      setPositionState: () => {},
    };
    vi.stubGlobal("navigator", { ...navigator, mediaSession: session });
    vi.stubGlobal("MediaMetadata", function (m) {
      Object.assign(this, m);
    });
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    vi.spyOn(LocalStorage, "getAudioSpeed").mockReturnValue(null);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  // jsdom's <audio> can't play; this one tracks paused/play/pause like a real
  // one and fires the same events. `refuse` makes play() reject, as iOS does
  // when the page has lost its audio session.
  function fakeMedia(audio, { refuse = false } = {}) {
    let paused = true;
    Object.defineProperty(audio, "paused", { get: () => paused, configurable: true });
    audio.play = vi.fn(() => {
      if (refuse) return Promise.reject(new Error("NotAllowedError"));
      paused = false;
      fireEvent(audio, new Event("play"));
      return Promise.resolve();
    });
    audio.pause = vi.fn(() => {
      paused = true;
      fireEvent(audio, new Event("pause"));
    });
  }

  async function startPlaying(container) {
    const audio = container.querySelector("audio");
    fakeMedia(audio);
    await act(async () => {
      await audio.play();
    });
    return audio;
  }

  it("headset pause, then headset play, plays again", async () => {
    const { container } = render(<CustomAudioPlayer src="a.mp3" language="es" />);
    const audio = await startPlaying(container);

    act(() => handlers.pause());
    expect(audio.paused).toBe(true);
    expect(session.playbackState).toBe("paused");

    await act(async () => handlers.play());
    expect(audio.paused).toBe(false);
    expect(session.playbackState).toBe("playing");
  });

  it("if iOS refuses play() once, the next press still plays", async () => {
    // Before, a refused play() still marked the player as playing, so every
    // later press was treated as "already playing" and did nothing.
    const { container } = render(<CustomAudioPlayer src="a.mp3" language="es" />);
    const audio = await startPlaying(container);
    act(() => handlers.pause());

    fakeMedia(audio, { refuse: true });
    vi.spyOn(console, "error").mockImplementation(() => {});
    await act(async () => handlers.play());
    expect(session.playbackState).toBe("paused");

    fakeMedia(audio);
    await act(async () => handlers.play());
    expect(audio.paused).toBe(false);
    expect(session.playbackState).toBe("playing");
  });

  it("reopening after a pause the page never saw shows the player as paused", async () => {
    // iOS suspends the page in the background; a pause there can happen
    // without a 'pause' event reaching us. Reopening the app used to show
    // "pause" over silent audio (and try to auto-resume).
    const { container } = render(<CustomAudioPlayer src="a.mp3" language="es" />);
    const audio = await startPlaying(container);
    expect(session.playbackState).toBe("playing");

    Object.defineProperty(audio, "paused", { get: () => true, configurable: true });
    audio.play.mockClear();
    act(() => document.dispatchEvent(new Event("visibilitychange")));

    expect(session.playbackState).toBe("paused");
    expect(audio.play).not.toHaveBeenCalled();
  });

  it("a headset play counts as a play", async () => {
    const onPlay = vi.fn();
    const { container } = render(<CustomAudioPlayer src="a.mp3" language="es" onPlay={onPlay} />);
    await startPlaying(container);
    act(() => handlers.pause());
    onPlay.mockClear();

    await act(async () => handlers.play());
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("keeps saving progress when the parent re-renders with new callbacks", async () => {
    // Parents pass inline callbacks; re-subscribing on each render used to
    // clear the 10s progress timer after the first save.
    vi.useFakeTimers();
    try {
      const saves = [];
      const props = (n) => ({ src: "a.mp3", language: "es", onProgressUpdate: (s) => saves.push([n, s]) });
      const { container, rerender } = render(<CustomAudioPlayer {...props(1)} />);
      const audio = await startPlaying(container);

      let t = 0;
      Object.defineProperty(audio, "currentTime", { get: () => t, set: (v) => (t = v), configurable: true });
      t = 10;
      act(() => vi.advanceTimersByTime(10000));
      rerender(<CustomAudioPlayer {...props(2)} />);
      t = 20;
      act(() => vi.advanceTimersByTime(10000));

      expect(saves).toEqual([
        [1, 10],
        [2, 20],
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("focusing the window doesn't wipe the lock-screen info", async () => {
    const { container } = render(<CustomAudioPlayer src="a.mp3" language="es" title="Lesson 3" />);
    await startPlaying(container);
    expect(session.metadata?.title).toBe("Lesson 3");

    act(() => window.dispatchEvent(new Event("focus")));
    expect(session.metadata?.title).toBe("Lesson 3");
  });
});
