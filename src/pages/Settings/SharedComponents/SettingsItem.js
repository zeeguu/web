import * as s from "./SettingsItem.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";
import { NavLink } from "react-router-dom";

export default function SettingsItem({ children, path, state, icon }) {
  const targetPath = path || "/";
  const to = state ? { pathname: targetPath, state } : targetPath;

  return (
    <s.SettingsItem>
      <NavLink className={"settings-link"} to={to}>
        <s.ItemLabel>
          {icon}
          {children}
        </s.ItemLabel>
        <RoundedForwardArrow fontSize="small" sx={{ color: "#808080" }} />
      </NavLink>
    </s.SettingsItem>
  );
}
