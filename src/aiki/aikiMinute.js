import { toast } from "react-toastify";

import {
  ZeeguuShield,
  isLearningSession,
  learningSecondsInFlight,
  nativeShieldAvailable,
  onLedgerUpdate,
} from "../components/nativeShield";

// The clock behind the Aiki unlock countdown. The ledger (Aiki.swift) is the truth:
// every learning report returns its state, and the learner hears about a
// break only once the ledger has granted it. Between reports the countdown adds the
// seconds the ledger has not counted yet (still in the open sessions, or sent
// and not answered), so it ticks every second.
//
// An Aiki session starts when the learner opens /aiki, if Aiki
// mode is on and the day is not free yet, and ends when the day becomes free.

let ledger = null; // the ledger's latest state, while a session runs
const liveSessions = new Set();
let aikiPagesOpen = 0; // /aiki shows the countdown too, standing still
const sessionListeners = new Set();

// Reads the ledger afresh even when a session is already running: the app may
// have stayed open overnight, or Aiki mode may have been switched off since.
export function startAikiSession() {
  if (!nativeShieldAvailable()) return;
  ZeeguuShield.getStatus()
    .then((status) => setLedger(status.shieldActive && !status.freeToday ? status : null))
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
  if (news === "unlocked") toast(unlockedMessage(next.breakUntil));
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

// The break's length comes from the ledger rather than a constant here.
export function unlockedMessage(breakUntil, now = Date.now()) {
  const minutes = Math.round((breakUntil - now) / 60000);
  if (minutes <= 0) return "Your paused apps are unlocked";
  return `Your paused apps are unlocked for ${minutes} minute${minutes === 1 ? "" : "s"}`;
}

// Called by useSession while a session runs; returns the unregister function.
export function trackLiveSession(label, getUnreportedSeconds) {
  if (!isLearningSession(label)) return () => {};
  liveSessions.add(getUnreportedSeconds);
  return () => liveSessions.delete(getUnreportedSeconds);
}

// Called by AikiPage while it is open; returns the unregister function.
export function trackAikiPage() {
  aikiPagesOpen += 1;
  return () => (aikiPagesOpen -= 1);
}

// Seconds until the learner's next minute unlocks the paused apps, or null
// when there is nothing to count down: no Aiki session, neither a learning
// screen nor /aiki open, or a break already running (it comes back if the
// break runs out). On /aiki nothing is counted, so it stands still.
export function aikiSecondsToUnlock(now = Date.now()) {
  if (!ledger || (liveSessions.size === 0 && aikiPagesOpen === 0)) return null;
  let unreported = learningSecondsInFlight();
  liveSessions.forEach((get) => (unreported += Math.max(0, get())));
  return secondsToUnlock(ledger, unreported, now);
}

// The ledger says how far the next unlock is (secondsToNextUnlock); the
// countdown subtracts what it has not counted yet. A break that ran out since
// the ledger last answered means a fresh minute, as the ledger will count it.
// Ledgers from before secondsToNextUnlock count to the next whole minute.
// While the ledger has not answered for that minute, this stays at 0.
export function secondsToUnlock(state, unreportedSeconds, now) {
  if (state.breakUntil && state.breakUntil > now) return null;
  const toGo = state.breakUntil
    ? 60
    : (state.secondsToNextUnlock ?? 60 - (state.learnedSecondsToday % 60));
  return Math.max(0, toGo - unreportedSeconds);
}
