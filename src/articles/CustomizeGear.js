import { useState, useRef, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import * as s from "./CustomizeGear.sc";

export default function CustomizeGear() {
  const history = useHistory();
  const location = useLocation();
  const isHomeActive = location.pathname === "/articles";
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGearClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleItemClick = (path) => {
    history.push(path);
    setShowDropdown(false);
  };

  if (!isHomeActive) {
    return null;
  }

  return (
    <s.GearWrapper ref={dropdownRef}>
      <s.GearButton onClick={handleGearClick} $isActive={showDropdown} title="Customize feed">
        <SettingsRoundedIcon style={{ fontSize: "1rem" }} />
      </s.GearButton>

      {showDropdown && (
        <s.DropdownMenu>
          <s.DropdownItem onClick={() => handleItemClick("/account_settings/interests?fromArticles=1")}>
            Topics
          </s.DropdownItem>
          <s.DropdownItem onClick={() => handleItemClick("/account_settings/filters?fromArticles=1")}>
            Filters
          </s.DropdownItem>
        </s.DropdownMenu>
      )}
    </s.GearWrapper>
  );
}
