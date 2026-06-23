import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Android12Switch } from "../MUIToggleThemes";

export default function ToggleOption({ checked, onToggle, label, className }) {
  return (
    <FormControlLabel
      checked={checked}
      control={<Android12Switch onClick={() => onToggle(!checked)} />}
      className={className}
      label={label}
    />
  );
}
