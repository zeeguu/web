import FormGroup from "@mui/material/FormGroup";
import ToggleOption from "../components/Toggles/ToggleOption";

export default function ToggleEditReviewWords({ setInEditMode, inEditMode }) {
  return (
    <FormGroup>
      <ToggleOption
        checked={inEditMode}
        onToggle={setInEditMode}
        className={inEditMode ? "selected" : ""}
        label={<span style={{ fontWeight: "500" }}>{"Manage words for exercises"}</span>}
      />
    </FormGroup>
  );
}
