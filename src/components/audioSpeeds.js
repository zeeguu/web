// Playback speeds offered by the audio player. Above 1x is for advanced learners
// who want to train their ear on faster speech.
export const SPEED_OPTIONS = [0.8, 0.85, 0.9, 0.95, 1, 1.1, 1.25, 1.5];
export const DEFAULT_SPEED = 1;

export const formatSpeed = (s) => `${s}x`;

const storageKey = (language) => `audioSpeed_${language}`;

// localStorage holds whatever an older build (or a hand edit) wrote there; a
// value that isn't on offer would show as "NaNx" or set an invalid rate.
export function parseStoredSpeed(stored) {
  const speed = parseFloat(stored);
  return SPEED_OPTIONS.includes(speed) ? speed : DEFAULT_SPEED;
}

// Speeds are remembered per learned language. Without a language there is
// nothing to key on, so the default is used and nothing is saved.
export function loadSpeed(language) {
  if (!language) return DEFAULT_SPEED;
  return parseStoredSpeed(localStorage.getItem(storageKey(language)));
}

export function saveSpeed(language, speed) {
  if (language) localStorage.setItem(storageKey(language), String(speed));
}
