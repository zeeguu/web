import * as React from "react";
import { useState, useEffect, useRef } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import ToggleOption from "../components/Toggles/ToggleOption";
import { ToolbarButtonRoot, ToolbarMenu, toolbarFormGroupSx, experimentalHelperText } from "./ToolbarButtons.sc";
import SettingsIconButton from "../components/Icons/SettingsIconButton";
import TextSizeControl from "../components/Controls/TextSizeControl";

export default function ToolbarButtons({
  translating,
  setTranslating,
  pronouncing,
  setPronouncing,
  showMweHints,
  setShowMweHints,
  showReadingTimer,
  setShowReadingTimer,
  readerFontSize,
  setReaderFontSize,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showOptions) return;

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  return (
    <ToolbarButtonRoot ref={menuRef}>
      <SettingsIconButton onClick={() => setShowOptions(!showOptions)} title="Click word options" />

      {showOptions && (
        <ToolbarMenu>
          <FormGroup sx={toolbarFormGroupSx}>
            <FormHelperText>{"Click word(s) to:"}</FormHelperText>
            <ToggleOption
              checked={translating}
              onToggle={setTranslating}
              className={translating ? "selected" : ""}
              label="See translation"
            />
            <ToggleOption
              checked={pronouncing}
              onToggle={setPronouncing}
              className={pronouncing ? "selected" : ""}
              label="Hear pronunciation"
            />
            <ToggleOption
              checked={showReadingTimer}
              onToggle={setShowReadingTimer}
              className={showReadingTimer ? "selected" : ""}
              label="Show reading timer"
            />
            {setReaderFontSize && (
              <TextSizeControl
                value={readerFontSize}
                onDecrease={() => setReaderFontSize(readerFontSize - 2)}
                onIncrease={() => setReaderFontSize(readerFontSize + 2)}
              />
            )}
            <FormHelperText style={experimentalHelperText}>{<small>{"Experimental:"}</small>}</FormHelperText>
            <ToggleOption
              checked={showMweHints}
              onToggle={setShowMweHints}
              className={showMweHints ? "selected" : ""}
              label="Show multi-word expressions hints"
            />
          </FormGroup>
        </ToolbarMenu>
      )}
    </ToolbarButtonRoot>
  );
}
