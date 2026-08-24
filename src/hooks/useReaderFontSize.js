import { useState } from "react";

const STORAGE_KEY = "reader_font_size";
const DEFAULT_SIZE = 18;
const MIN_SIZE = 14;
const MAX_SIZE = 28;
export const FONT_SIZE_STEP = 2;

// The reader's text size, persisted per device in localStorage. Shared by every
// surface that renders interactive text at the user's chosen size (the reader,
// and the Text & highlighting settings page) so the value and its 14–28px clamp
// are defined once instead of re-implemented per caller.
//
// Per-device on purpose: unlike the other reading preferences (which live
// server-side in useUserPreferences), a comfortable text size depends on the
// screen you are holding, not on who you are.
export default function useReaderFontSize() {
  const [fontSize, setFontSizeState] = useState(() => {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    return Number.isFinite(saved) ? saved : DEFAULT_SIZE;
  });

  function setFontSize(value) {
    const clamped = Math.max(MIN_SIZE, Math.min(MAX_SIZE, value));
    setFontSizeState(clamped);
    localStorage.setItem(STORAGE_KEY, String(clamped));
  }

  return [fontSize, setFontSize];
}
