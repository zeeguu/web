import * as React from "react";
import { useState, useEffect, useRef } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import ToggleOption from "../components/Toggles/ToggleOption";
import { ToolbarButtonRoot, ToolbarMenu } from "./ToolbarButtons.sc";
import SettingsIconButton from "../components/Icons/SettingsIconButton";
import TextSizeControl from "../components/Controls/TextSizeControl";
import { READING_TOGGLES, EXPERIMENTAL_SECTION } from "./readingPreferences";
import { FONT_SIZE_STEP } from "../hooks/useReaderFontSize";

// MUI sx / inline-style overrides (not styled-components, so they live here
// rather than in ToolbarButtons.sc.js).
const toolbarFormGroupSx = {
  "& .MuiFormControlLabel-label": { color: "var(--text-primary)" },
  "& .MuiFormHelperText-root": { color: "var(--text-secondary)" },
};

const experimentalHelperText = {
  marginTop: "0.5rem",
};

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

  // The toggles themselves are defined in readingPreferences.js — shared with
  // the Text & highlighting settings page, which writes the same values. These
  // two maps bind that shared list to this component's props, keyed by the
  // list's `key`, so adding a toggle there only needs a prop pair here.
  const isOn = { translating, pronouncing, showReadingTimer, showMweHints };
  const setOn = {
    translating: setTranslating,
    pronouncing: setPronouncing,
    showReadingTimer: setShowReadingTimer,
    showMweHints: setShowMweHints,
  };

  function renderToggle(option) {
    return (
      <ToggleOption
        key={option.key}
        checked={isOn[option.key]}
        onToggle={setOn[option.key]}
        className={isOn[option.key] ? "selected" : ""}
        label={option.label}
      />
    );
  }

  const mainToggles = READING_TOGGLES.filter((option) => option.section !== EXPERIMENTAL_SECTION);
  const experimentalToggles = READING_TOGGLES.filter((option) => option.section === EXPERIMENTAL_SECTION);

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
            {mainToggles.map(renderToggle)}
            {setReaderFontSize && (
              <TextSizeControl
                value={readerFontSize}
                onDecrease={() => setReaderFontSize(readerFontSize - FONT_SIZE_STEP)}
                onIncrease={() => setReaderFontSize(readerFontSize + FONT_SIZE_STEP)}
              />
            )}
            <FormHelperText style={experimentalHelperText}>{<small>{"Experimental:"}</small>}</FormHelperText>
            {experimentalToggles.map(renderToggle)}
          </FormGroup>
        </ToolbarMenu>
      )}
    </ToolbarButtonRoot>
  );
}
