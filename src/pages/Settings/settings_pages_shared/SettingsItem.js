import * as s from "./SettingsItem.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";
import { NavLink } from "react-router-dom";

export default function SettingsItem({ children, path }) {
  return (
    <s.SettingsItem>
      <NavLink className={"settings-link"} to={path ? path : "/"}>
        {children}{" "}
        <RoundedForwardArrow fontSize="small" sx={{ color: "#808080" }} />
      </NavLink>
    </s.SettingsItem>
  );
}
