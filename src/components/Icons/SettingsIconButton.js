import React from "react";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { settingsButtonRoot, settingsIcon } from "./SettingsIconButton.sc";

export default function SettingsIconButton({ onClick, title }) {
  return (
    <div onClick={onClick} title={title} style={settingsButtonRoot}>
      <SettingsRoundedIcon style={settingsIcon} />
    </div>
  );
}
