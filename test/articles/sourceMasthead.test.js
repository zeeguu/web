import { describe, expect, it } from "vitest";
import { sourceMasthead } from "../../src/utils/misc/articleHelpers";

describe("sourceMasthead", () => {
  it("drops the TLD from a domain", () => {
    expect(sourceMasthead("politiken.dk")).toBe("politiken");
  });

  it("drops www and multi-part TLDs", () => {
    expect(sourceMasthead("www.bbc.co.uk")).toBe("bbc");
  });

  it("names the site, not its subdomain", () => {
    expect(sourceMasthead("nyheder.tv2.dk")).toBe("tv2");
  });

  it("keeps a feed name as is", () => {
    expect(sourceMasthead("Politiken")).toBe("Politiken");
  });
});
