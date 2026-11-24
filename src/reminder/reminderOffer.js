import { dayKey } from "./studyReminder";

// Offering the study reminder when the daily goal is reached (ADR 046): not at
// onboarding, because iOS asks for notification permission only once, and a
// learner who refuses before Zeeguu has been useful can only undo it in the
// phone's Settings. The system prompt only appears after "Remind me".
//
// "Not now" is remembered on this phone (each phone has its own permission)
// and the offer comes back after OFFER_AGAIN_AFTER_DAYS.

export const OFFER_AGAIN_AFTER_DAYS = 7;
export const REMINDER_OFFER_EVENT = "STUDY_REMINDER_OFFER";
const LAST_OFFERED_KEY = "study_reminder_offered_on";

// Whether to offer the reminder now, when the goal was just reached.
// `permission` is the phone's ("granted" | "denied" | "prompt" | null); once
// denied the app can no longer ask, so there is nothing to offer.
export function shouldOfferReminder({ available, enabled, goalMinutes, permission, lastOfferedOn, now }) {
  if (!available || enabled || !goalMinutes) return false;
  if (permission === "denied") return false;
  if (!lastOfferedOn) return true;
  const again = new Date(lastOfferedOn + "T00:00:00");
  again.setDate(again.getDate() + OFFER_AGAIN_AFTER_DAYS);
  return dayKey(now) >= dayKey(again);
}

export function lastOfferedOn() {
  return localStorage.getItem(LAST_OFFERED_KEY);
}

export function noteOffered(now = new Date()) {
  localStorage.setItem(LAST_OFFERED_KEY, dayKey(now));
}
