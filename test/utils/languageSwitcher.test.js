import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import LocalStorage from "../../src/assorted/LocalStorage";
import * as userInfoCookies from "../../src/utils/cookies/userInfo";
import { switchLanguage } from "../../src/utils/languageSwitcher";

// Applying a language remounts every page, and each fetches against the
// language the server has saved. Applied before the save lands, they got
// the previous language's articles and exercises, cached under the new one.
describe("switchLanguage", () => {
  beforeEach(() => {
    vi.spyOn(LocalStorage, "setUserInfo").mockImplementation(() => {});
    vi.spyOn(userInfoCookies, "saveSharedUserInfo").mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  function fakeApi(fresh) {
    const saves = [];
    return {
      saves,
      saveUserDetails: (details, onError, onSuccess) => saves.push({ details, onError, onSuccess }),
      getUserDetails: vi.fn(() => Promise.resolve(fresh)),
    };
  }

  const danish = { learned_language: "da", native_language: "en" };

  it("applies nothing until the server has saved the switch", () => {
    const api = fakeApi();
    const setUserDetails = vi.fn();

    switchLanguage(api, danish, setUserDetails, "bg");

    expect(api.saves[0].details.learned_language).toBe("bg");
    expect(setUserDetails).not.toHaveBeenCalled();
    expect(LocalStorage.setUserInfo).not.toHaveBeenCalled();
  });

  it("applies the switch once saved, then the fresh details", async () => {
    const fresh = { ...danish, learned_language: "bg", bg_cefr_level: 1 };
    const api = fakeApi(fresh);
    const setUserDetails = vi.fn();
    const onDone = vi.fn();
    const onSaved = vi.fn();

    switchLanguage(api, danish, setUserDetails, "bg", onDone, onSaved);
    await api.saves[0].onSuccess();

    expect(onSaved).toHaveBeenCalledBefore(setUserDetails);
    expect(setUserDetails.mock.calls.map(([d]) => d)).toEqual([{ ...danish, learned_language: "bg" }, fresh]);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("stays on the switched language when the refresh fails", async () => {
    const api = fakeApi();
    api.getUserDetails = vi.fn(() => Promise.reject(new Error("offline")));
    const setUserDetails = vi.fn();

    switchLanguage(api, danish, setUserDetails, "bg");
    await api.saves[0].onSuccess();

    expect(setUserDetails).toHaveBeenCalledTimes(1);
    expect(setUserDetails.mock.calls[0][0].learned_language).toBe("bg");
  });

  it("leaves everything as it was when the save fails", () => {
    const api = fakeApi();
    const setUserDetails = vi.fn();
    const onDone = vi.fn();

    switchLanguage(api, danish, setUserDetails, "bg", onDone);
    api.saves[0].onError();

    expect(setUserDetails).not.toHaveBeenCalled();
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
