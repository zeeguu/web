import toggle from "../utils/misc/toggle";
import * as React from "react";
import { useState } from "react";
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
}) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <SettingsRoundedIcon 
        style={{ 
          fontSize: "1.4em", 
          cursor: "pointer",
          color: "#999"
        }}
        title="Click word options"
        onClick={() => setShowOptions(!showOptions)}
      />
      
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
              <FormHelperText>{<small>{"Click word(s) to:"}</small>}</FormHelperText>
              <FormControlLabel
                checked={translating}
                control={
                  <Android12Switch
                    onClick={(e) => toggle(translating, setTranslating)}
                  />
                }
                className={translating ? "selected" : ""}
                label={<small>{"See translation"}</small>}
              />
              <FormControlLabel
                checked={pronouncing}
                control={
                  <Android12Switch
                    onClick={(e) => toggle(pronouncing, setPronouncing)}
                  />
                }
                className={pronouncing ? "selected" : ""}
                label={<small>{"Hear pronunciation"}</small>}
              />
            </FormGroup>
          </ThemeProvider>
        </div>
      )}
    </div>
  );
}
