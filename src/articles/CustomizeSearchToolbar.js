import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { ThemeProvider } from "@mui/material/styles";
import { t, Android12Switch } from "../components/MUIToggleThemes";
import toggle from "../utils/misc/toggle";

export default function CustomizeSearchToolbar({
  searchPublishPriority,
  setSearchPublishPriority,
  searchDifficultyPriority,
  setSearchDifficultyPriority,
}) {
  return (
    <>
      <ThemeProvider theme={t}>
        <FormGroup>
          <FormHelperText>{<small>{"Adjust search:"}</small>}</FormHelperText>
          <FormControlLabel
            checked={searchPublishPriority}
            control={
              <Android12Switch
                onClick={(e) =>
                  toggle(searchPublishPriority, setSearchPublishPriority)
                }
              />
            }
            className={searchPublishPriority ? "selected" : ""}
            label={<small>{"Prioritize recent articles"}</small>}
          />
          <FormControlLabel
            checked={searchDifficultyPriority}
            control={
              <Android12Switch
                onClick={(e) =>
                  toggle(searchDifficultyPriority, setSearchDifficultyPriority)
                }
              />
            }
            className={searchDifficultyPriority ? "selected" : ""}
            label={<small>{"Prioritize articles in my level"}</small>}
          />
        </FormGroup>
      </ThemeProvider>
    </>
  );
}
