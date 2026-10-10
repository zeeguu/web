import { correctnessBasedOnTries, isCleanAnswer } from "../../CorrectnessBasedOnTries";

export const COOLING_INTERVALS_PER_LEVEL = 3; // cooling intervals 0, 1, and 2

// The level and step a word will have once the api has scheduled this answer,
// so the bar can show it before the next fetch. Mirrors the api scheduler
// (four_levels_per_word.py): three correct answers per level; while the word is
// on the fast track (the api's per-word `fast_track`), a clean answer (first
// try, no hint) moves it up a level at once.
export function predictAfterAnswer({ level, cooling_interval, message, fastTrack = false }) {
  const [userIsCorrect, userIsWrong] = correctnessBasedOnTries(message);

  if (userIsCorrect && fastTrack && isCleanAnswer(message)) {
    return { level: level + 1, cooling_interval: 0 };
  }
  if (userIsCorrect) {
    cooling_interval = cooling_interval + 1;
    if (cooling_interval === COOLING_INTERVALS_PER_LEVEL) {
      level += 1;
      cooling_interval = 0;
    }
  }
  if (userIsWrong && cooling_interval > 0) {
    cooling_interval = cooling_interval - 1;
  }
  return { level, cooling_interval };
}

// Whether this answer makes the word learned. The api says
// is_about_to_be_learned for every level-4 word on the fast track, but only a
// clean answer, or any correct one at the longest interval (is_last_in_cycle),
// actually learns it.
export function isWordLearned({ message, is_about_to_be_learned, is_last_in_cycle }) {
  const [userIsCorrect] = correctnessBasedOnTries(message);
  return Boolean(
    userIsCorrect && is_about_to_be_learned && (is_last_in_cycle || isCleanAnswer(message)),
  );
}
