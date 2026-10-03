import { vi } from "vitest";

// jsdom runs on localhost, where funnelEvent posts with fetch, not a beacon.
const fetchMock = vi.fn(() => Promise.resolve({}));
vi.stubGlobal("fetch", fetchMock);

// A stand-in: newer Node ships its own global localStorage, which shadows
// jsdom's and has no clear().
const store = new Map();
vi.stubGlobal("localStorage", {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
});

const { Zeeguu_API } = await import("../../src/api/classDef");
const { funnelError } = await import("../../src/api/onboardingFunnel");

const api = new Zeeguu_API("https://api.zeeguu.org");

function sent() {
  return fetchMock.mock.calls.map(([url, options]) => ({ url, ...JSON.parse(options.body) }));
}

beforeEach(() => {
  fetchMock.mockClear();
  store.clear();
  api.setSession(undefined);
  vi.useFakeTimers();
});

afterEach(() => vi.useRealTimers());

describe("funnelEvent", () => {
  test("one funnel id across steps, entry point taken from the first step", () => {
    api.funnelEvent("landing_viewed");
    vi.advanceTimersByTime(5000);
    api.funnelEvent("invite_code_viewed");

    const [first, second] = sent();
    expect(first.funnel_id).toBe(second.funnel_id);
    expect([first.entry_point, second.entry_point]).toEqual(["landing", "landing"]);
    expect(first.detail).toEqual({ first: true });
    expect(second.detail).toEqual({ previous_step: "landing_viewed", seconds_since_previous: 5 });
  });

  test("a step sent twice within a second is sent once (StrictMode double mount)", () => {
    api.funnelEvent("welcome_viewed");
    api.funnelEvent("welcome_viewed");
    expect(sent()).toHaveLength(1);
  });

  test("leaving the app does not reset the clock of the page it was left on", () => {
    api.funnelEvent("account_form_viewed");
    vi.advanceTimersByTime(10000);
    api.funnelEvent("page_hidden", { on: "account_form" });
    vi.advanceTimersByTime(50000);
    api.funnelEvent("account_created");

    const last = sent()[2];
    expect(last.detail).toEqual({ previous_step: "account_form_viewed", seconds_since_previous: 60 });
  });

  test("with a session the event carries it, so the API can claim the funnel", () => {
    api.setSession("abc");
    api.funnelEvent("anon_account_created");
    expect(sent()[0].url).toBe("https://api.zeeguu.org/onboarding_funnel_event?session=abc");
  });

  test("logout starts a new funnel", () => {
    api.funnelEvent("landing_viewed");
    api.resetFunnel();
    api.funnelEvent("welcome_viewed");

    const [before, after] = sent();
    expect(before.funnel_id).not.toBe(after.funnel_id);
    expect(after.entry_point).toBe("app");
  });
});

describe("funnelError", () => {
  test("keeps the message, drops any address in it", () => {
    expect(funnelError("No account for a.b@example.com here")).toBe("No account for <email> here");
    expect(funnelError(new Error("Too many requests"))).toBe("Too many requests");
    expect(funnelError("x".repeat(500))).toHaveLength(200);
  });
});
