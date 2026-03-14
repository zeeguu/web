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

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    return LocalStorage.getThemePreference() || getOSTheme();
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for OS theme changes (only when user hasn't set a preference)
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

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      LocalStorage.setThemePreference(next);
      return next;
    });
  }, []);

  const resetToOS = useCallback(() => {
    LocalStorage.clearThemePreference();
    setTheme(getOSTheme());
  }, []);

  return useMemo(
    () => ({ theme, toggleTheme, resetToOS, isDark: theme === "dark" }),
    [theme, toggleTheme, resetToOS],
  );
}
