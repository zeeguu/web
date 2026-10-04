import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";

/**
 * On iOS lessons play through the native ZeeguuAudio plugin, so headset /
 * lock-screen controls keep working once the webview is suspended. These
 * check the player follows the native player rather than its own guesses.
 */

// One fake native player for the whole file, like the real singleton.
const native = vi.hoisted(() => {
  const listeners = {};
  const state = { url: "", isPlaying: false, position: 0, duration: 363 };
  const plugin = {
    addListener: (name, fn) => {
      (listeners[name] = listeners[name] || []).push(fn);
      return Promise.resolve({ remove: () => {} });
    },
    probe: () => Promise.resolve({ duration: 363 }),
    prepare: async ({ url, position }) => Object.assign(state, { url, position: position || 0, isPlaying: false }),
    play: async () => {
      state.isPlaying = true;
    },
    pause: async () => {
      state.isPlaying = false;
    },
    seek: async () => {},
    setRate: async () => {},
    setMuted: async () => {},
    setMetadata: async () => {},
    getState: async () => ({ ...state }),
    unload: async () => {
      Object.assign(state, { url: "", isPlaying: false });
    },
  };
  // What the native side sends when the learner uses the headset.
  const emit = (name, data = {}) =>
    (listeners[name] || []).forEach((fn) => fn({ url: state.url, position: state.position, duration: 363, ...data }));
  return { plugin, state, emit };
});

vi.mock("@capacitor/core", () => ({
  Capacitor: {
    getPlatform: () => "ios",
    isPluginAvailable: (name) => name === "ZeeguuAudio",
  },
  registerPlugin: () => native.plugin,
}));

import LocalStorage from "../../src/assorted/LocalStorage";
import CustomAudioPlayer from "../../src/components/CustomAudioPlayer";

const showsPlayButton = (container) => !!container.querySelector('[data-testid="PlayArrowRoundedIcon"]');

async function renderPlayer(props = {}) {
  const utils = render(<CustomAudioPlayer src="lesson.mp3" language="da" {...props} />);
  await act(async () => {}); // let probe() resolve
  return utils;
}

async function pressPlay(container) {
  const button = container.querySelector('[data-testid="PlayArrowRoundedIcon"]').closest("button");
  await act(async () => fireEvent.click(button));
}

describe("CustomAudioPlayer on the native iOS player", () => {
  beforeEach(() => {
    vi.spyOn(LocalStorage, "getAudioSpeed").mockReturnValue(null);
    vi.spyOn(native.plugin, "prepare");
  });

  it("plays through the native player, not an <audio> element", async () => {
    const { container, getByText } = await renderPlayer();
    expect(container.querySelector("audio")).toBeNull();
    expect(getByText("6:03")).toBeTruthy(); // duration from probe()

    await pressPlay(container);
    expect(native.plugin.prepare).toHaveBeenCalledWith(expect.objectContaining({ url: "lesson.mp3" }));
    expect(native.state.isPlaying).toBe(true);
    expect(showsPlayButton(container)).toBe(false);
  });

  it("starts a half-heard lesson where it was left", async () => {
    const { container } = await renderPlayer({ initialProgress: 34 });
    await pressPlay(container);
    expect(native.plugin.prepare).toHaveBeenCalledWith(expect.objectContaining({ position: 34 }));
  });

  it("a headset pause shows up as paused", async () => {
    const { container } = await renderPlayer();
    await pressPlay(container);

    native.state.isPlaying = false;
    act(() => native.emit("pause"));
    expect(showsPlayButton(container)).toBe(true);
  });

  it("on return, shows what the native player is actually doing", async () => {
    // A pause while the webview was suspended may never reach the page.
    const { container } = await renderPlayer();
    await pressPlay(container);
    expect(showsPlayButton(container)).toBe(false);

    native.state.isPlaying = false;
    native.state.position = 120;
    await act(async () => document.dispatchEvent(new Event("visibilitychange")));
    expect(showsPlayButton(container)).toBe(true);
  });

  it("ignores events about a different lesson", async () => {
    const { container } = await renderPlayer();
    await pressPlay(container);

    act(() => native.emit("pause", { url: "another-lesson.mp3" }));
    expect(showsPlayButton(container)).toBe(false);
  });

  it("a headset play counts as a play (listening time, lesson state)", async () => {
    const onPlay = vi.fn();
    const { container } = await renderPlayer({ onPlay });
    await pressPlay(container);
    expect(onPlay).toHaveBeenCalledTimes(1);

    native.state.isPlaying = false;
    act(() => native.emit("pause"));
    native.state.isPlaying = true;
    act(() => native.emit("play"));
    expect(onPlay).toHaveBeenCalledTimes(2);
    expect(showsPlayButton(container)).toBe(false);
  });

  it("a lesson started while another is still loading doesn't leave both 'playing'", async () => {
    const { container } = render(
      <>
        <CustomAudioPlayer src="a.mp3" language="da" />
        <CustomAudioPlayer src="b.mp3" language="da" />
      </>,
    );
    await act(async () => {});
    const [a, b] = container.querySelectorAll('[data-testid="PlayArrowRoundedIcon"]');

    let finishPreparingA;
    native.plugin.prepare.mockImplementationOnce(
      (args) =>
        new Promise((resolve) => {
          finishPreparingA = () => resolve(Object.assign(native.state, { url: args.url }));
        }),
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
    await act(async () => fireEvent.click(a.closest("button")));
    await act(async () => fireEvent.click(b.closest("button")));
    await act(async () => finishPreparingA());

    const players = container.querySelectorAll("button > svg");
    const playing = [...players].filter((svg) => svg.dataset.testid === "PauseRoundedIcon");
    expect(playing).toHaveLength(1);
  });

  it("leaving the page stops the lesson", async () => {
    const { container, unmount } = await renderPlayer();
    await pressPlay(container);
    unmount();
    expect(native.state.isPlaying).toBe(false);
  });
});
