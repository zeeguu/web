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

  const theme = resolveTheme(preference);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for OS theme changes (only applies when preference is "auto")
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (preference === "auto") {
        applyTheme(getOSTheme());
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [preference]);

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
