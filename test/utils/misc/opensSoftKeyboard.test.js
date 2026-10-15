import { describe, it, expect } from "vitest";
import { opensSoftKeyboard } from "../../../src/utils/misc/opensSoftKeyboard";

function input(attrs = {}) {
  const el = document.createElement("input");
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

describe("opensSoftKeyboard", () => {
  it("is true for text-like inputs and textareas", () => {
    expect(opensSoftKeyboard(input())).toBe(true);
    expect(opensSoftKeyboard(input({ type: "email" }))).toBe(true);
    expect(opensSoftKeyboard(input({ type: "search" }))).toBe(true);
    expect(opensSoftKeyboard(document.createElement("textarea"))).toBe(true);
  });

  it("is false for buttons, checkboxes and the like", () => {
    expect(opensSoftKeyboard(input({ type: "checkbox" }))).toBe(false);
    expect(opensSoftKeyboard(input({ type: "submit" }))).toBe(false);
    expect(opensSoftKeyboard(document.createElement("button"))).toBe(false);
    expect(opensSoftKeyboard(document.body)).toBe(false);
    expect(opensSoftKeyboard(null)).toBe(false);
  });

  it("is false when the OS keyboard is suppressed or the field is read-only", () => {
    expect(opensSoftKeyboard(input({ inputmode: "none" }))).toBe(false);
    expect(opensSoftKeyboard(input({ readonly: "" }))).toBe(false);
  });
});
