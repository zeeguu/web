import React from "react";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";

// Zeeguu-styled toggle: Android-12 look (rounded track with ✓/— icons) in the
// brand orange. Self-contained — colours and shape live here, so callers don't
// need a MUI <ThemeProvider>. Just render <ToggleOption ... />.

const ORANGE = "#ffbb54";
const GREY_THUMB = "#ccc";
const GREY_TRACK = "#999999";

const icon = (svgPath) =>
  `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="white" d="${svgPath}"/></svg>')`;

const CHECK_ICON = icon("M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"); // ✓ shown on the "on" side
const DASH_ICON = icon("M19,13H5V11H19V13Z"); // — shown on the "off" side

const StyledSwitch = styled(Switch)({
  padding: 8,
  "& .MuiSwitch-switchBase": {
    color: GREY_THUMB, // thumb when off
    "&.Mui-checked": {
      color: ORANGE, // thumb when on
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 11,
    opacity: 0.7,
    backgroundColor: GREY_TRACK, // track when off
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": { backgroundImage: CHECK_ICON, left: 12 },
    "&:after": { backgroundImage: DASH_ICON, right: 12 },
  },
  "& .Mui-checked.Mui-checked + .MuiSwitch-track": {
    opacity: 0.5,
    backgroundColor: ORANGE, // track when on
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
});

export default function ToggleOption({ checked, onToggle, label, className }) {
  return (
    <FormControlLabel
      checked={checked}
      control={<StyledSwitch onClick={() => onToggle(!checked)} />}
      className={className}
      label={label}
    />
  );
}
