import toggle from "../utils/misc/toggle";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { ThemeProvider } from "@mui/material/styles";
import { t, Android12Switch } from "../components/MUIToggleThemes";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

export default function ToolbarButtons({
  translating,
  setTranslating,
  pronouncing,
  setPronouncing,
  showMweHints,
  setShowMweHints,
  showReadingTimer,
  setShowReadingTimer,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showOptions) return;

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  return (
    <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      <div
        onClick={() => setShowOptions(!showOptions)}
        title="Click word options"
        style={{ padding: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <SettingsRoundedIcon style={{ fontSize: "1.4em", color: "#999" }} />
      </div>

      {showOptions && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: "0",
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 1000,
          padding: "1rem",
          minWidth: "200px"
        }}>
          <ThemeProvider theme={t}>
            <FormGroup>
              <FormHelperText>{"Click word(s) to:"}</FormHelperText>
              <FormControlLabel
                checked={translating}
                control={
                  <Android12Switch
                    onClick={(e) => toggle(translating, setTranslating)}
                  />
                }
                className={translating ? "selected" : ""}
                label={"See translation"}
              />
              <FormControlLabel
                checked={pronouncing}
                control={
                  <Android12Switch
                    onClick={(e) => toggle(pronouncing, setPronouncing)}
                  />
                }
                className={pronouncing ? "selected" : ""}
                label={"Hear pronunciation"}
              />
              <FormControlLabel
                checked={showReadingTimer}
                control={
                  <Android12Switch
                    onClick={(e) => toggle(showReadingTimer, setShowReadingTimer)}
                  />
                }
                className={showReadingTimer ? "selected" : ""}
                label={"Show reading timer"}
              />
              <FormHelperText style={{ marginTop: "0.5rem" }}>{<small>{"Experimental:"}</small>}</FormHelperText>
              <FormControlLabel
                checked={showMweHints}
                control={
                  <Android12Switch
                    onClick={(e) => toggle(showMweHints, setShowMweHints)}
                  />
                }
                className={showMweHints ? "selected" : ""}
                label={"Show multi-word expressions hints"}
              />
            </FormGroup>
          </ThemeProvider>
        </div>
      )}
    </div>
  );
}
