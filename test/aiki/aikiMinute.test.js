import { describe, it, expect, vi, beforeEach } from "vitest";

const native = vi.hoisted(() => ({ status: null, ledgerListener: null, inFlight: 0 }));

vi.mock("react-toastify", () => ({ toast: vi.fn() }));
vi.mock("../../src/components/nativeShield", () => ({
  ZeeguuShield: { getStatus: () => Promise.resolve(native.status) },
  nativeShieldAvailable: () => true,
  isLearningSession: (label) => ["reading", "exercise", "listening", "browsing", "watching"].includes(label),
  learningSecondsInFlight: () => native.inFlight,
  onLedgerUpdate: (listener) => (native.ledgerListener = listener),
}));

import { toast } from "react-toastify";
import {
  aikiSecondsToUnlock,
  aikiSessionActive,
  endAikiSession,
  ledgerNews,
  secondsToUnlock,
  startAikiSession,
  trackAikiPage,
  trackLiveSession,
  unlockedMessage,
} from "../../src/aiki/aikiMinute";

const locked = { shieldActive: true, freeToday: false, learnedSecondsToday: 100, dailyGoalSeconds: 900 };

async function start(status) {
  native.status = status;
  startAikiSession();
  await Promise.resolve();
  await Promise.resolve();
}

describe("aikiMinute", () => {
  beforeEach(() => {
    endAikiSession();
    native.inFlight = 0;
    toast.mockClear();
  });

  it("starts only when Aiki mode is on and the day is not free", async () => {
    await start({ ...locked, shieldActive: false });
    expect(aikiSessionActive()).toBe(false);
    await start({ ...locked, freeToday: true });
    expect(aikiSessionActive()).toBe(false);
    await start(locked);
    expect(aikiSessionActive()).toBe(true);
  });

  it("counts from the ledger, plus what it has not counted yet", async () => {
    await start(locked);
    // 100 counted by the ledger + 5 in flight + 3 in the open session.
    const untrack = trackLiveSession("reading", () => 3);
    native.inFlight = 5;
    expect(aikiSecondsToUnlock()).toBe(12);
    untrack();
  });

  it("stays hidden when no learning screen is open", async () => {
    await start(locked);
    const untrack = trackLiveSession("settings", () => 10);
    expect(aikiSecondsToUnlock()).toBeNull();
    untrack();
  });

  it("reads the ledger afresh when /aiki opens again", async () => {
    await start(locked);
    await start({ ...locked, learnedSecondsToday: 0 });
    const untrack = trackAikiPage();
    expect(aikiSecondsToUnlock()).toBe(60);
    untrack();
    await start({ ...locked, shieldActive: false });
    expect(aikiSessionActive()).toBe(false);
  });

  it("shows on /aiki, standing still", async () => {
    await start(locked);
    const untrack = trackAikiPage();
    expect(aikiSecondsToUnlock()).toBe(20);
    untrack();
    expect(aikiSecondsToUnlock()).toBeNull();
  });

  it("says the apps are unlocked once the ledger starts a break", async () => {
    await start(locked);
    native.ledgerListener({ ...locked, learnedSecondsToday: 120, breakUntil: Date.now() + 300000 });
    expect(toast).toHaveBeenCalledWith("Your paused apps are unlocked for 5 minutes");
  });

  it("ends the session when the ledger frees the day", async () => {
    await start(locked);
    native.ledgerListener({ ...locked, learnedSecondsToday: 900, freeToday: true });
    expect(toast).toHaveBeenCalledWith("Your paused apps are free for the rest of the day");
    expect(aikiSessionActive()).toBe(false);
  });
});

describe("ledgerNews", () => {
  const now = 1000000;
  it("is quiet when a running break is only extended", () => {
    expect(ledgerNews({ breakUntil: now + 100 }, { breakUntil: now + 300 }, now)).toBeNull();
  });

  it("announces a new break after the last one ran out", () => {
    expect(ledgerNews({ breakUntil: now - 1 }, { breakUntil: now + 300 }, now)).toBe("unlocked");
  });
});

describe("secondsToUnlock", () => {
  const now = 1000000;
  it("counts down to the end of the first minute", () => {
    expect(secondsToUnlock({ learnedSecondsToday: 0 }, 10, now)).toBe(50);
  });

  it("counts from what the ledger already has", () => {
    expect(secondsToUnlock({ learnedSecondsToday: 130 }, 5, now)).toBe(45);
  });

  it("is hidden while a break runs", () => {
    expect(secondsToUnlock({ learnedSecondsToday: 70, breakUntil: now + 1000 }, 5, now)).toBeNull();
  });

  it("needs a fresh minute once the break has run out", () => {
    expect(secondsToUnlock({ learnedSecondsToday: 97, secondsToNextUnlock: 23, breakUntil: now - 1 }, 5, now)).toBe(55);
  });

  it("counts down what the ledger says is left", () => {
    expect(secondsToUnlock({ learnedSecondsToday: 157, secondsToNextUnlock: 60 }, 5, now)).toBe(55);
  });

  it("stays at 0 until the ledger answers, instead of wrapping", () => {
    expect(secondsToUnlock({ learnedSecondsToday: 50 }, 25, now)).toBe(0);
  });
});

describe("unlockedMessage", () => {
  const now = 1_000_000;
  it("says how long the break lasts", () => {
    expect(unlockedMessage(now + 300000, now)).toBe("Your paused apps are unlocked for 5 minutes");
    expect(unlockedMessage(now + 299000, now)).toBe("Your paused apps are unlocked for 5 minutes");
  });
  it("says a single minute in the singular", () => {
    expect(unlockedMessage(now + 60000, now)).toBe("Your paused apps are unlocked for 1 minute");
  });
  it("leaves the length out when there is none to give", () => {
    expect(unlockedMessage(now + 10000, now)).toBe("Your paused apps are unlocked");
  });
});
