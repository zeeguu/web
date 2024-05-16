import * as s from "./ArticleReader.sc";
import { toggle } from "./ArticleReader";
import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { ThemeProvider } from "@mui/material/styles";
import { t, Android12Switch } from "../components/MUIToggleThemes";

export default function ToolbarButtons({
  translating,
  setTranslating,
  pronouncing,
  setPronouncing,
}) {
  return (
    <s.Toolbar style={{ float: "right", width: "auto", height: "auto" }}>
      <ThemeProvider theme={t}>
        <FormGroup>
          <FormHelperText>
            {<small>{"Click word(s) to:"}</small>}
          </FormHelperText>
          <FormControlLabel
            control={<Android12Switch defaultChecked />}
            className={translating ? "selected" : ""}
            onClick={(e) => toggle(translating, setTranslating)}
            label={<small>{"See translation"}</small>}
          />
          <FormControlLabel
            control={<Android12Switch defaultChecked />}
            className={pronouncing ? "selected" : ""}
            onClick={(e) => toggle(pronouncing, setPronouncing)}
            label={<small>{"Hear pronunciation"}</small>}
          />
        </FormGroup>
      </ThemeProvider>
    </s.Toolbar>
  );
}
