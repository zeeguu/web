import { toast } from "react-toastify";

import {
  ZeeguuShield,
  isLearningSession,
  learningSecondsInFlight,
  nativeShieldAvailable,
  onLedgerUpdate,
} from "../components/nativeShield";

// The clock behind the Aiki minute bar. The ledger (Aiki.swift) is the truth:
// every learning report returns its state, and the learner hears about a
// break only once the ledger has granted it. Between reports the bar adds the
// seconds the ledger has not counted yet (still in the open sessions, or sent
// and not answered), so it moves smoothly.
//
// An Aiki session starts when the learner picks something on /aiki, if Aiki
// mode is on and the day is not free yet, and ends when the day becomes free.

let ledger = null; // the ledger's latest state, while a session runs
const liveSessions = new Set();
const sessionListeners = new Set();

export function startAikiSession() {
  if (ledger || !nativeShieldAvailable()) return;
  ZeeguuShield.getStatus()
    .then((status) => {
      if (!ledger && status.shieldActive && !status.freeToday) setLedger(status);
    })
    .catch(() => {});
}

export function endAikiSession() {
  setLedger(null);
}

function setLedger(next) {
  ledger = next;
  sessionListeners.forEach((listener) => listener());
}

export function aikiSessionActive() {
  return ledger !== null;
}

export function subscribeAikiSession(listener) {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
}

onLedgerUpdate((next) => {
  if (!ledger) return;
  const news = ledgerNews(ledger, next);
  if (news === "free") {
    toast("Your paused apps are free for the rest of the day");
    endAikiSession();
    return;
  }
  if (news === "unlocked") toast("Your paused apps are unlocked");
  setLedger(next);
});

// What a ledger update means for the learner: "unlocked" when a break starts
// (not when a running one is extended), "free" when the day's goal is met.
export function ledgerNews(before, after, now = Date.now()) {
  if (after.freeToday && !before.freeToday) return "free";
  const onBreak = (state) => !!state.breakUntil && state.breakUntil > now;
  if (onBreak(after) && !onBreak(before)) return "unlocked";
  return null;
}

// Called by useSession while a session runs; returns the unregister function.
export function trackLiveSession(label, getUnreportedSeconds) {
  if (!isLearningSession(label)) return () => {};
  liveSessions.add(getUnreportedSeconds);
  return () => liveSessions.delete(getUnreportedSeconds);
}

// Today's learning seconds and the goal, or null when the bar should not show:
// no Aiki session, or no learning screen open.
export function aikiProgress() {
  if (!ledger || liveSessions.size === 0) return null;
  let unreported = learningSecondsInFlight();
  liveSessions.forEach((get) => (unreported += Math.max(0, get())));
  return { seconds: ledger.learnedSecondsToday + unreported, goalSeconds: ledger.dailyGoalSeconds };
}
