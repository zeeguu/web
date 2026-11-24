// A tapped word pulses until its translation arrives. A request that never
// settles (a connection dropped as the phone switched networks, a request iOS
// froze with the app in the background) left it pulsing for good, and only
// leaving the text and opening it again brought it back. Translations take
// 0.2-1s; a split expression goes through an LLM and takes a few seconds.
export const TRANSLATION_DEADLINE_MS = 8000;

// Calls `onGiveUp` once `ms` pass without `settle()`. `settle()` returns
// whether it came in time: true the first time before the deadline, false
// after the deadline gave up or once already settled, so each outcome is
// reported once.
export function translationDeadline(onGiveUp, ms = TRANSLATION_DEADLINE_MS) {
  let over = false;
  const timer = setTimeout(() => {
    over = true;
    onGiveUp();
  }, ms);
  return {
    settle() {
      clearTimeout(timer);
      const inTime = !over;
      over = true;
      return inTime;
    },
  };
}
