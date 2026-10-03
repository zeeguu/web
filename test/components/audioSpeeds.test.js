import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { SPEED_PRESETS, parseStoredSpeed, snapSpeed, loadSpeed, saveSpeed } from "../../src/components/audioSpeeds";
import LocalStorage from "../../src/assorted/LocalStorage";

/**
 * Audio lesson playback speed: what's on offer, and remembering the learner's
 * choice per learned language.
 */
describe("parseStoredSpeed", () => {
  it("reads back the presets and any 0.05 step in range", () => {
    for (const speed of [...SPEED_PRESETS, 0.85, 1.05, 1.35]) {
      expect(parseStoredSpeed(String(speed))).toBe(speed);
    }
  });

  it("falls back to 1x for nothing stored, junk, or a speed out of range", () => {
    expect(parseStoredSpeed(null)).toBe(1);
    expect(parseStoredSpeed("abc")).toBe(1);
    expect(parseStoredSpeed("3")).toBe(1);
    expect(parseStoredSpeed("0.5")).toBe(1);
  });
});

describe("snapSpeed", () => {
  it("rounds to the 0.05 grid without float noise, and clamps", () => {
    expect(snapSpeed(0.8 + 0.05)).toBe(0.85);
    expect(snapSpeed(1.123)).toBe(1.1);
    expect(snapSpeed(0.7)).toBe(0.8);
    expect(snapSpeed(2)).toBe(1.5);
  });
});

describe("loadSpeed / saveSpeed", () => {
  // Through the LocalStorage module, stubbed: newer Node ships its own global
  // localStorage, which shadows jsdom's.
  let store;
  beforeEach(() => {
    store = new Map();
    vi.spyOn(LocalStorage, "getAudioSpeed").mockImplementation((lang) => store.get(lang) ?? null);
    vi.spyOn(LocalStorage, "setAudioSpeed").mockImplementation((lang, speed) => store.set(lang, String(speed)));
  });
  afterEach(() => vi.restoreAllMocks());

  it("remembers a speed per language", () => {
    saveSpeed("es", 1.25);
    saveSpeed("da", 0.85);
    expect(loadSpeed("es")).toBe(1.25);
    expect(loadSpeed("da")).toBe(0.85);
    expect(loadSpeed("fr")).toBe(1);
  });

  it("without a language, uses 1x and saves nothing", () => {
    saveSpeed(undefined, 1.5);
    expect(store.size).toBe(0);
    expect(loadSpeed(undefined)).toBe(1);
  });
});
