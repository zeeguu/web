import { useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeContext } from "../../contexts/ThemeContext";
import { t as muiToggleTheme } from "../../components/MUIToggleThemes";
import Switch from "@mui/material/Switch";
import * as s from "./DarkModeToggle.sc";

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <s.ToggleRow>
      <span>Dark Mode</span>
      <ThemeProvider theme={muiToggleTheme}>
        <Switch checked={isDark} onChange={toggleTheme} />
      </ThemeProvider>
    </s.ToggleRow>
  );
}
