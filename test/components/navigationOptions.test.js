import { describe, it, expect } from "vitest";
import { isNavOptionActive } from "../../src/components/MainNav/navigationOptions";

describe("isNavOptionActive", () => {
  it("keeps Translate active on every Translate tab, whichever it opens", () => {
    expect(isNavOptionActive("/translate/history", "/translate")).toBe(true);
    expect(isNavOptionActive("/translate", "/translate/history")).toBe(true);
    expect(isNavOptionActive("/translate/history", "/articles")).toBe(false);
  });

  it("keeps Read active on every Read tab", () => {
    expect(isNavOptionActive("/articles/shared", "/articles")).toBe(true);
    expect(isNavOptionActive("/articles", "/swiper")).toBe(true);
  });
});
