import { useContext, useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { APIContext } from "../contexts/APIContext";
import * as s from "./CustomizeGear.sc";

const MAX_TITLES_SHOWN = 3;

function chipLabel(topics) {
  if (!topics || topics.length === 0) return "Personalize your feed";
  const titles = topics.map((t) => t.title);
  if (titles.length <= MAX_TITLES_SHOWN) return `Topics: ${titles.join(", ")}`;
  const shown = titles.slice(0, MAX_TITLES_SHOWN).join(", ");
  return `Topics: ${shown} +${titles.length - MAX_TITLES_SHOWN}`;
}

export default function CustomizeGear() {
  const api = useContext(APIContext);
  const history = useHistory();
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [subscribedTopics, setSubscribedTopics] = useState(null);

  useEffect(() => {
    api.getSubscribedTopics((data) => setSubscribedTopics(data || []));
  }, [api]);

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

  const handleChipClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleItemClick = (path) => {
    history.push(path);
    setShowDropdown(false);
  };

  return (
    <s.GearWrapper ref={dropdownRef}>
      <s.GearButton onClick={handleChipClick} $isActive={showDropdown} title="Customize feed">
        <span>{chipLabel(subscribedTopics)}</span>
        <SettingsRoundedIcon style={{ fontSize: "0.95rem" }} />
      </s.GearButton>

      {showDropdown && (
        <s.DropdownMenu>
          <s.DropdownItem onClick={() => handleItemClick("/account_settings/interests?fromArticles=1")}>
            Topics of Interest
          </s.DropdownItem>
          <s.DropdownItem onClick={() => handleItemClick("/account_settings/filters?fromArticles=1")}>
            Topics to Avoid
          </s.DropdownItem>
        </s.DropdownMenu>
      )}
    </s.GearWrapper>
  );
}
