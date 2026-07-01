import React from "react";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { SettingsButtonRoot, SettingsIconStyle } from "./SettingsIconButton.sc";

export default function SettingsIconButton({ onClick, title }) {
  return (
    <SettingsButtonRoot onClick={onClick} title={title}>
      <SettingsIconStyle>
        <SettingsRoundedIcon />
      </SettingsIconStyle>
    </SettingsButtonRoot>
  );
}
