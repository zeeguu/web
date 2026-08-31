import { describe, it, expect } from "vitest";
import { browsingModeProps } from "../../src/articles/browsingMode";
import { articleSourceLabel } from "../../src/utils/misc/articleHelpers";

describe("browsingModeProps", () => {
  it("makes the interactive card interactive and not compact", () => {
    expect(browsingModeProps("interactive")).toEqual({ interactive: true, compact: false });
  });

  it("makes headlines compact and not interactive", () => {
    expect(browsingModeProps("titles")).toEqual({ interactive: false, compact: true });
  });

  it("leaves preview as the teaser card: neither", () => {
    expect(browsingModeProps("preview")).toEqual({ interactive: false, compact: false });
  });

  // A reader who has never opened the setting has no stored mode.
  it("treats an unset mode as the teaser card", () => {
    expect(browsingModeProps(undefined)).toEqual({ interactive: false, compact: false });
  });
});

describe("articleSourceLabel", () => {
  it("prefers the feed's own name", () => {
    expect(articleSourceLabel({ feed_name: "Politiken", url: "https://politiken.dk/x" })).toBe("Politiken");
  });

  it("falls back to the article's domain", () => {
    expect(articleSourceLabel({ url: "https://www.dr.dk/nyheder/x" })).toBe("dr.dk");
  });

  // Teacher-uploaded texts get a synthetic url from the API
  // (`Url("userarticle/<uuid>")` in teacher_dashboard/article_management.py),
  // which used to print on the card as the publisher "userarticle".
  it("names no publisher for a text a teacher typed in", () => {
    expect(articleSourceLabel({ url: "userarticle/2b9c1f7a4e" })).toBe("");
  });
});
