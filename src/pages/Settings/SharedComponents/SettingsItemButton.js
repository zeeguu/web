import * as s from "./SettingsItem.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";

export default function SettingsItemButton({ children, onClick, icon }) {
  return (
    <s.SettingsItem onClick={onClick}>
      <span className="settings-link">
        <s.ItemLabel>
          {icon}
          {children}
        </s.ItemLabel>
        <RoundedForwardArrow fontSize="small" sx={{ color: "#808080" }} />
      </span>
    </s.SettingsItem>
  );
}
