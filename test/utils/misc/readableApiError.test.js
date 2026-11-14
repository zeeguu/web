import { describe, it, expect } from "vitest";
import { readableApiError } from "../../../src/utils/misc/readableApiError";

describe("readableApiError", () => {
  it("shows the server's own message", () => {
    expect(readableApiError("This text is too long.", "fallback")).toBe("This text is too long.");
  });

  it("falls back on a bare HTTP status", () => {
    expect(readableApiError("HTTP 500", "fallback")).toBe("fallback");
    expect(readableApiError(" HTTP 413 ", "fallback")).toBe("fallback");
  });

  it("falls back on nothing useful", () => {
    expect(readableApiError(undefined, "fallback")).toBe("fallback");
    expect(readableApiError("", "fallback")).toBe("fallback");
    expect(readableApiError(new TypeError("Failed to fetch"), "fallback")).toBe("fallback");
  });
});
