import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { APIContext } from "../../src/contexts/APIContext";
import { UserContext } from "../../src/contexts/UserContext";
import useGuardedLanguageSwitch from "../../src/hooks/useGuardedLanguageSwitch";
import { switchLanguage } from "../../src/utils/languageSwitcher";

const history = { push: vi.fn() };
let pathname;
let idInUrl;

vi.mock("react-router-dom", () => ({
  useHistory: () => history,
  useLocation: () => ({ pathname }),
}));
vi.mock("../../src/hooks/useQuery", () => ({ default: () => ({ get: () => idInUrl }) }));
vi.mock("../../src/utils/languageSwitcher", () => ({ switchLanguage: vi.fn() }));
vi.mock("../../src/utils/misc/languageCodeToName", () => ({ languageName: () => "French" }));

function setup(api) {
  const wrapper = ({ children }) => (
    <APIContext.Provider value={api}>
      <UserContext.Provider value={{ userDetails: { learned_language: "da" }, setUserDetails: () => {} }}>
        {children}
      </UserContext.Provider>
    </APIContext.Provider>
  );
  const { result } = renderHook(() => useGuardedLanguageSwitch(), { wrapper });
  act(() => result.current.requestSwitch("fr"));
  return result;
}

const dialog = (result) => result.current.confirmModal?.props;

describe("switching language while reading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pathname = "/read/article";
    idInUrl = "7";
  });

  it("goes on reading the translation once the switch is saved", () => {
    const api = { translateAndAdaptArticle: (_, __, callback) => callback({ id: 42 }) };
    switchLanguage.mockImplementation((_, __, ___, ____, onDone, onSaved) => {
      onSaved();
      onDone();
    });
    const result = setup(api);

    act(() => dialog(result).onPrimary());

    expect(history.push).toHaveBeenCalledWith("/read/article?id=42");
    expect(result.current.confirmModal).toBeNull();
  });

  it("stops the spinner and says so when a link cannot be resolved", () => {
    pathname = "/read/abc";
    idInUrl = null;
    const api = { getArticleLinkInfo: (_, __, onError) => onError("nope"), translateAndAdaptArticle: vi.fn() };
    const result = setup(api);

    act(() => dialog(result).onPrimary());

    expect(api.translateAndAdaptArticle).not.toHaveBeenCalled();
    expect(dialog(result).isLoading).toBe(false);
    expect(dialog(result).message).toContain("could not be translated");
  });

  it("says so when the translation fails, and does not switch", () => {
    const api = { translateAndAdaptArticle: (_, __, ___, onError) => onError("nope") };
    const result = setup(api);

    act(() => dialog(result).onPrimary());

    expect(switchLanguage).not.toHaveBeenCalled();
    expect(dialog(result).isLoading).toBe(false);
    expect(dialog(result).message).toContain("could not be translated");
  });

  it("says so when the switch cannot be saved, and stays in the reader", () => {
    const api = { translateAndAdaptArticle: (_, __, callback) => callback({ id: 42 }) };
    switchLanguage.mockImplementation((_, __, ___, ____, onDone) => onDone());
    const result = setup(api);

    act(() => dialog(result).onPrimary());

    expect(history.push).not.toHaveBeenCalled();
    expect(dialog(result).isLoading).toBe(false);
    expect(dialog(result).message).toContain("could not be saved");
  });
});
