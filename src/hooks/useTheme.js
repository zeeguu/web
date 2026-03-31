import { useState, useEffect, useCallback, useMemo } from "react";
import LocalStorage from "../assorted/LocalStorage";

// Key and attribute name must stay in sync with the inline script in index.html
function getOSTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function resolveTheme(preference) {
  if (preference === "dark" || preference === "light") return preference;
  return getOSTheme();
}

export default function useTheme() {
  const [preference, setPreferenceState] = useState(
    () => LocalStorage.getThemePreference() || "auto",
  );
  const [theme, setTheme] = useState(() => resolveTheme(preference));

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // When preference changes explicitly, update resolved theme
  useEffect(() => {
    setTheme(resolveTheme(preference));
  }, [preference]);

  // Listen for OS theme changes so "auto" stays in sync
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!LocalStorage.getThemePreference()) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setPreference = useCallback((value) => {
    setPreferenceState(value);
    if (value === "auto") {
      LocalStorage.clearThemePreference();
    } else {
      LocalStorage.setThemePreference(value);
    }
  }, []);

  return useMemo(
    () => ({ theme, preference, setPreference, isDark: theme === "dark" }),
    [theme, preference, setPreference],
  );
}
