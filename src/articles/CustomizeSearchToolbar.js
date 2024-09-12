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
            control={<Android12Switch />}
            className={searchPublishPriority ? "selected" : ""}
            onClick={(e) =>
              toggle(searchPublishPriority, setSearchPublishPriority)
            }
            label={<small>{"Prioritize recent articles"}</small>}
          />
          <FormControlLabel
            checked={searchDifficultyPriority}
            control={<Android12Switch />}
            className={searchDifficultyPriority ? "selected" : ""}
            onClick={(e) =>
              toggle(searchDifficultyPriority, setSearchDifficultyPriority)
            }
            label={<small>{"Prioritize articles in my level"}</small>}
          />
        </FormGroup>
      </ThemeProvider>
    </>
  );
}
