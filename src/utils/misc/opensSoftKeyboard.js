const NON_TEXT_INPUT_TYPES = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "hidden",
  "image",
  "radio",
  "range",
  "reset",
  "submit",
]);

// Whether focusing this element brings up the phone's on-screen keyboard.
// inputMode="none" is how BottomInput suppresses it in favour of the
// in-page VirtualKeyboard.
export function opensSoftKeyboard(element) {
  if (!element) return false;
  if (element.inputMode === "none" || element.getAttribute?.("inputmode") === "none") return false;
  if (element.isContentEditable) return true;
  const tag = element.tagName;
  if (tag === "TEXTAREA") return !element.readOnly;
  if (tag === "INPUT") return !element.readOnly && !NON_TEXT_INPUT_TYPES.has((element.type || "text").toLowerCase());
  return false;
}
