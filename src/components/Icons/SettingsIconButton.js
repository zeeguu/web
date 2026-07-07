import React from "react";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import IconButton from "./IconButton";

export default function SettingsIconButton({ onClick, title }) {
  return (
    <IconButton onClick={onClick} ariaLabel={title}>
      <SettingsRoundedIcon />
    </IconButton>
  );
}
