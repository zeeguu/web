import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import ToggleOption from "../components/Toggles/ToggleOption";
import toggle from "../utils/misc/toggle";

export default function CustomizeSearchToolbar({
  searchPublishPriority,
  setSearchPublishPriority,
  searchDifficultyPriority,
  setSearchDifficultyPriority,
}) {
  return (
    <FormGroup>
      <FormHelperText>{<small>{"Adjust search:"}</small>}</FormHelperText>
      <ToggleOption
        checked={searchPublishPriority}
        onToggle={() => toggle(searchPublishPriority, setSearchPublishPriority)}
        className={searchPublishPriority ? "selected" : ""}
        label={<small>{"Prioritize recent articles"}</small>}
      />
      <ToggleOption
        checked={searchDifficultyPriority}
        onToggle={() => toggle(searchDifficultyPriority, setSearchDifficultyPriority)}
        className={searchDifficultyPriority ? "selected" : ""}
        label={<small>{"Prioritize articles in my level"}</small>}
      />
    </FormGroup>
  );
}
