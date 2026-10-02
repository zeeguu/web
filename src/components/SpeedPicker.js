import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { zeeguuTransparentMediumOrange } from "./colors";
import { SPEED_OPTIONS, formatSpeed } from "./audioSpeeds";

// Tap the pill, pick a speed. With speeds on both sides of 1x, a tap-to-cycle
// pill made the common move (1x -> slower) four taps through 1.1-1.5x.
export default function SpeedPicker({ value, onChange, disabled }) {
  const [anchor, setAnchor] = useState(null);
  const pick = (speed) => {
    setAnchor(null);
    onChange(speed);
  };
  return (
    <>
      <button
        type="button"
        onClick={(e) => setAnchor(e.currentTarget)}
        disabled={disabled}
        aria-haspopup="menu"
        aria-label={`Playback speed (current ${formatSpeed(value)})`}
        style={{
          background: "transparent",
          border: `1.5px solid ${disabled ? "#ccc" : "var(--player-icon-color)"}`,
          // A stadium rather than a circle: "0.85x" and "1.25x" touched a 38px
          // circle's edge. Fixed width, so the row doesn't shift between speeds.
          borderRadius: "19px",
          width: "46px",
          height: "38px",
          padding: 0,
          color: disabled ? "#ccc" : "var(--player-icon-color)",
          fontSize: "12px",
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
        }}
      >
        {formatSpeed(value)}
      </button>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        // MUI has no theme here, so its default white menu ignores dark mode.
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              // MUI's own hover/focus tints are black at 4-12%: invisible on the
              // dark surface. Hover only where there is hover (see CLAUDE.md, iOS).
              "& .MuiMenuItem-root.Mui-focusVisible": { backgroundColor: "var(--bg-tertiary)" },
              "& .MuiMenuItem-root.Mui-selected, & .MuiMenuItem-root.Mui-selected.Mui-focusVisible": {
                backgroundColor: zeeguuTransparentMediumOrange,
              },
              "@media (hover: hover)": {
                "& .MuiMenuItem-root:hover": { backgroundColor: "var(--bg-tertiary)" },
                "& .MuiMenuItem-root.Mui-selected:hover": { backgroundColor: zeeguuTransparentMediumOrange },
              },
            },
          },
        }}
      >
        {SPEED_OPTIONS.map((speed) => (
          <MenuItem key={speed} selected={speed === value} onClick={() => pick(speed)}>
            {formatSpeed(speed)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
