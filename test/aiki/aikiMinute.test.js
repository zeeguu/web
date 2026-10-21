import { describe, it, expect, vi, beforeEach } from "vitest";

const native = vi.hoisted(() => ({ status: null, ledgerListener: null, inFlight: 0 }));

vi.mock("react-toastify", () => ({ toast: vi.fn() }));
vi.mock("../../src/components/nativeShield", () => ({
  ZeeguuShield: { getStatus: () => Promise.resolve(native.status) },
  nativeShieldAvailable: () => true,
  isLearningSession: (label) => ["reading", "exercise", "listening"].includes(label),
  learningSecondsInFlight: () => native.inFlight,
  onLedgerUpdate: (listener) => (native.ledgerListener = listener),
}));

import { toast } from "react-toastify";
import {
  aikiProgress,
  aikiSessionActive,
  endAikiSession,
  ledgerNews,
  startAikiSession,
  trackLiveSession,
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
    const untrack = trackLiveSession("reading", () => 20);
    native.inFlight = 5;
    expect(aikiProgress()).toEqual({ seconds: 125, goalSeconds: 900 });
    untrack();
  });

  it("stays hidden when no learning screen is open", async () => {
    await start(locked);
    const untrack = trackLiveSession("browsing", () => 10);
    expect(aikiProgress()).toBeNull();
    untrack();
  });

  it("says the apps are unlocked once the ledger starts a break", async () => {
    await start(locked);
    native.ledgerListener({ ...locked, learnedSecondsToday: 120, breakUntil: Date.now() + 300000 });
    expect(toast).toHaveBeenCalledWith("Your paused apps are unlocked");
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
