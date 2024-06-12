import { t, Android12Switch } from "../components/MUIToggleThemes";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ThemeProvider } from "@mui/material/styles";

export default function ToggleEditReviewWords({ setInEditMode, inEditMode }) {
  return (
    <ThemeProvider theme={t} style={{ marginBottom: "-1em" }}>
      <FormGroup>
        <FormControlLabel
          control={<Android12Switch />}
          className={inEditMode ? "selected" : ""}
          onClick={(e) => setInEditMode(!inEditMode)}
          label={
            <span style={{ fontWeight: "500" }}>
              {"Manage Words for Exercises"}
            </span>
          }
        />
      </FormGroup>
    </ThemeProvider>
  );
}
