import { createContext } from "react";

export const ThemeContext = createContext({
  theme: "light",
  preference: "auto",
  isDark: false,
  setPreference: () => {},
});
