import * as s from "./ArticleReader.sc";
import toggle from "../utils/misc/toggle";
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
    </s.Toolbar>
  );
}
