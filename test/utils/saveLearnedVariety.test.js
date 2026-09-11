import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { saveLearnedVarietyAfterSignup } from "../../src/utils/misc/saveLearnedVariety";
import LocalStorage from "../../src/assorted/LocalStorage";

// Onboarding leaves the page with a full-document navigation the moment this
// settles, and that cancels a request still in flight -- so onDone has to run in
// every case, or a learner is stranded on the last step of signup.
describe("saveLearnedVarietyAfterSignup", () => {
  // Stubbed rather than driven through a real localStorage: these tests are about
  // when onDone runs, and the suite runs without a DOM.
  function parked(variety) {
    vi.spyOn(LocalStorage, "getLearnedVariety").mockReturnValue(variety);
  }

  beforeEach(() => {
    vi.useFakeTimers();
    parked("");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function fakeApi() {
    const calls = [];
    return {
      calls,
      saveUserDetails(details, onError, onSuccess) {
        calls.push({ details, onError, onSuccess });
      },
    };
  }

  it("saves the parked variety against the new session", () => {
    parked("BE");
    const api = fakeApi();

    saveLearnedVarietyAfterSignup(api);

    expect(api.calls).toHaveLength(1);
    expect(api.calls[0].details).toEqual({ feed_variety: "BE" });
  });

  it("does not call the API when nothing was chosen", () => {
    const api = fakeApi();
    let done = false;

    saveLearnedVarietyAfterSignup(api, () => (done = true));

    expect(api.calls).toHaveLength(0);
    expect(done).toBe(true);
  });

  it("continues once the save succeeds", () => {
    parked("BE");
    const api = fakeApi();
    let done = false;

    saveLearnedVarietyAfterSignup(api, () => (done = true));
    expect(done).toBe(false);

    api.calls[0].onSuccess();
    expect(done).toBe(true);
  });

  it("continues when the save fails, rather than holding up signup", () => {
    parked("BE");
    const api = fakeApi();
    let done = false;

    saveLearnedVarietyAfterSignup(api, () => (done = true));
    api.calls[0].onError("nope");

    expect(done).toBe(true);
  });

  it("gives up on a request that never answers", () => {
    parked("BE");
    const api = fakeApi();
    let done = false;

    saveLearnedVarietyAfterSignup(api, () => (done = true));
    expect(done).toBe(false);

    vi.advanceTimersByTime(2500);
    expect(done).toBe(true);
  });

  it("continues exactly once, however many ways the save reports back", () => {
    parked("BE");
    const api = fakeApi();
    let times = 0;

    saveLearnedVarietyAfterSignup(api, () => (times += 1));
    api.calls[0].onSuccess();
    api.calls[0].onError("late failure");
    vi.advanceTimersByTime(5000);

    expect(times).toBe(1);
  });
});
