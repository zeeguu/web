import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { SPEED_OPTIONS, parseStoredSpeed, loadSpeed, saveSpeed } from "../../src/components/audioSpeeds";
import LocalStorage from "../../src/assorted/LocalStorage";

/**
 * Audio lesson playback speed: what's on offer, and remembering the learner's
 * choice per learned language.
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
