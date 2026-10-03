// Playback speeds offered by the audio player: any 0.05 step in [MIN, MAX].
// Above 1x is for advanced learners who want to train their ear on faster speech.
import LocalStorage from "../assorted/LocalStorage";

export const MIN_SPEED = 0.8;
export const MAX_SPEED = 1.5;
export const SPEED_STEP = 0.05;
export const DEFAULT_SPEED = 1;
// One-tap shortcuts under the slider.
export const SPEED_PRESETS = [0.8, 0.9, 1, 1.25, 1.5];

export const formatSpeed = (s) => `${s}x`;

// Snap to the 0.05 grid and clamp to the range; toFixed drops float noise
// (0.8 + 0.05 is 0.8500000000000001).
export function snapSpeed(s) {
  const snapped = Math.round(s / SPEED_STEP) * SPEED_STEP;
  return parseFloat(Math.min(MAX_SPEED, Math.max(MIN_SPEED, snapped)).toFixed(2));
}

// localStorage holds whatever an older build (or a hand edit) wrote there; a
// value that isn't on offer would show as "NaNx" or set an invalid rate.
export function parseStoredSpeed(stored) {
  const speed = parseFloat(stored);
  if (!Number.isFinite(speed) || speed < MIN_SPEED || speed > MAX_SPEED) return DEFAULT_SPEED;
  return snapSpeed(speed);
}

// Speeds are remembered per learned language. Without a language there is
// nothing to key on, so the default is used and nothing is saved.
export function loadSpeed(language) {
  if (!language) return DEFAULT_SPEED;
  return parseStoredSpeed(LocalStorage.getAudioSpeed(language));
}

export function saveSpeed(language, speed) {
  if (language) LocalStorage.setAudioSpeed(language, speed);
}
