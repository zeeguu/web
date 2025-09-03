import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SwipeIcon from "@mui/icons-material/Swipe";
import ViewListIcon from "@mui/icons-material/ViewList";
import * as s from "./CustomizeFeed.sc";

export default function CustomizeFeed({ currentMode = "list" }) {
  const history = useHistory();
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

  const handleItemClick = (path) => {
    history.push(path);
    setShowDropdown(false);
  };

  return (
    <s.DropdownContainer ref={dropdownRef}>
      <s.CustomizeFeedButton
        onClick={() => setShowDropdown(!showDropdown)}
        className={showDropdown ? "active" : ""}
      >
        <SettingsRoundedIcon style={{ fontSize: "1.2em" }} />
        <span>Customize feed</span>
        <ArrowDropDownIcon
          style={{
            fontSize: "1.2em",
            transform: showDropdown ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s",
          }}
        />
      </s.CustomizeFeedButton>

      {showDropdown && (
        <s.DropdownMenu>
          <s.DropdownItem
            onClick={() => handleItemClick("/account_settings/interests?fromArticles=1")}
          >
            Topics
          </s.DropdownItem>
          <s.DropdownItem
            onClick={() => handleItemClick("/account_settings/excluded_keywords?fromArticles=1")}
          >
            Excluded Keywords
          </s.DropdownItem>
          <s.DropdownItem
            onClick={() => handleItemClick("/articles/mySearches")}
          >
            Saved Searches
          </s.DropdownItem>
          <s.Separator />
          {currentMode === "swiper" && (
            <s.DropdownItem
              onClick={() => handleItemClick("/articles")}
            >
              <ViewListIcon style={{ fontSize: "1.2em", marginRight: "0.5rem" }} />
              List Mode
            </s.DropdownItem>
          )}
          {currentMode === "list" && (
            <s.DropdownItem
              onClick={() => handleItemClick("/swiper")}
            >
              <SwipeIcon style={{ fontSize: "1.2em", marginRight: "0.5rem" }} />
              Swipe Mode
            </s.DropdownItem>
          )}
        </s.DropdownMenu>
      )}
    </s.DropdownContainer>
  );
}