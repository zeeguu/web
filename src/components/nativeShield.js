import { Capacitor, registerPlugin } from "@capacitor/core";

// Aiki mode on iOS (native-plugins/zeeguu-shield): the learner picks the apps
// they find distracting, and while the shield is on, opening one of them shows
// a shield screen instead. Uses Apple's Screen Time API (iOS 16+).

export const ZeeguuShield = registerPlugin("ZeeguuShield");

export function nativeShieldAvailable() {
  return Capacitor.getPlatform() === "ios" && Capacitor.isPluginAvailable("ZeeguuShield");
}

// Session labels (see hooks/use*Session.js) whose time earns Aiki breaks:
// every activity session, the same ones the streak counts (ADR 046).
const LEARNING_SESSIONS = ["reading", "exercise", "listening", "browsing", "watching"];

export function isLearningSession(label) {
  return LEARNING_SESSIONS.includes(label);
}

export function countsAsLearning(label, seconds) {
  return isLearningSession(label) && seconds > 0;
}

// Each report resolves with the ledger's state after it (older app builds
// resolve with nothing); aiki/aikiMinute.js listens to tell the learner.
const ledgerListeners = new Set();
let secondsInFlight = 0; // sent, but the ledger has not answered yet

export function onLedgerUpdate(listener) {
  ledgerListeners.add(listener);
  return () => ledgerListeners.delete(listener);
}

export function learningSecondsInFlight() {
  return secondsInFlight;
}

export function reportLearningSeconds(label, seconds) {
  if (!countsAsLearning(label, seconds) || !nativeShieldAvailable()) return;
  const rounded = Math.round(seconds);
  secondsInFlight += rounded;
  ZeeguuShield.addLearningSeconds({ seconds: rounded })
    .then((ledger) => {
      secondsInFlight -= rounded;
      if (ledger) ledgerListeners.forEach((listener) => listener(ledger));
    })
    .catch(() => (secondsInFlight -= rounded));
}

// The goal Aiki should use, from the learner's preferences (ADR 046): their
// daily goal, which for a new learner is the default 5 minutes. Null for the
// grandfathered 2 minutes of learners from before the goal existed: Aiki asks
// them to choose rather than free their apps after 2 minutes.
export const GRANDFATHERED_GOAL = "2";

export function chosenDailyGoal(preferences) {
  const value = preferences?.daily_goal_minutes;
  if (!value || value === GRANDFATHERED_GOAL) return null;
  const minutes = parseInt(value, 10);
  return minutes > 0 ? minutes : null;
}

// Hands the chosen goal to the ledger on the phone. Without one (the
// grandfathered 2, or logged out) it sends 0, and the ledger falls back to its
// own 15 minutes rather than keeping an earlier learner's goal. Older app
// builds have no setDailyGoal, or refuse 0: ignored.
export function sendDailyGoalToAiki(preferences) {
  if (!nativeShieldAvailable()) return;
  ZeeguuShield.setDailyGoal({ minutes: chosenDailyGoal(preferences) ?? 0 }).catch(() => {});
}

// Which setup step a learner is at, from ZeeguuShield.getStatus() and whether
// they have chosen a daily goal: Aiki frees the apps once the goal is met.
// A learner who already set Aiki up keeps its controls; the page asks them
// for a goal beside them.
export function aikiStep(status, goalChosen = true) {
  if (!status || !status.supported) return "unsupported";
  if (status.authorization === "approved" && pickedCount(status) > 0) return "ready";
  if (!goalChosen) return "goal";
  if (status.authorization !== "approved") return "authorize";
  if (pickedCount(status) === 0) return "pick";
  return "ready";
}

export function pickedCount(selection) {
  return (selection?.apps || 0) + (selection?.categories || 0) + (selection?.webDomains || 0);
}

// "2 apps and 1 category"
export function describePicked(selection) {
  const parts = [
    [selection?.apps, "app"],
    [selection?.categories, "category"],
    [selection?.webDomains, "website"],
  ]
    .filter(([n]) => n > 0)
    .map(([n, noun]) => `${n} ${n === 1 ? noun : noun === "category" ? "categories" : noun + "s"}`);
  return parts.join(" and ");
}
