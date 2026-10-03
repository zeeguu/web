import { useId, useState } from "react";
import { Popover, Slider } from "@mui/material";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { zeeguuOrange } from "./colors";
import { MIN_SPEED, MAX_SPEED, SPEED_STEP, SPEED_PRESETS, formatSpeed, snapSpeed } from "./audioSpeeds";
import {
  SpeedPill,
  SpeedPanel,
  SpeedReadout,
  SliderRow,
  StepButton,
  PresetRow,
  PresetPill,
} from "./SpeedPicker.sc";

const sliderSx = {
  color: zeeguuOrange,
  "& .MuiSlider-rail": { backgroundColor: "var(--border-color)", opacity: 1 },
};

// Like YouTube's speed panel: the exact value, -/+ in 0.05 steps around a
// slider, and one-tap presets. It stays open, so the learner can hear each
// change and adjust; tapping outside closes it.
function SpeedPanelContent({ value, onChange }) {
  const step = (direction) => onChange(snapSpeed(value + direction * SPEED_STEP));
  return (
    <SpeedPanel>
      <SpeedReadout>{value.toFixed(2)}x</SpeedReadout>
      <SliderRow>
        <StepButton type="button" aria-label="Slower" disabled={value <= MIN_SPEED} onClick={() => step(-1)}>
          <RemoveRoundedIcon />
        </StepButton>
        <Slider
          aria-label="Playback speed"
          value={value}
          min={MIN_SPEED}
          max={MAX_SPEED}
          step={SPEED_STEP}
          onChange={(_, v) => onChange(snapSpeed(v))}
          sx={sliderSx}
        />
        <StepButton type="button" aria-label="Faster" disabled={value >= MAX_SPEED} onClick={() => step(1)}>
          <AddRoundedIcon />
        </StepButton>
      </SliderRow>
      <PresetRow>
        {SPEED_PRESETS.map((speed) => (
          <PresetPill
            key={speed}
            type="button"
            className={speed === value ? "small selected" : "small"}
            aria-pressed={speed === value}
            onClick={() => onChange(speed)}
          >
            {formatSpeed(speed)}
          </PresetPill>
        ))}
      </PresetRow>
    </SpeedPanel>
  );
}

export default function SpeedPicker({ value, onChange, disabled }) {
  const [anchor, setAnchor] = useState(null);
  const panelId = useId();
  return (
    <>
      <SpeedPill
        type="button"
        onClick={(e) => setAnchor(e.currentTarget)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchor)}
        aria-controls={anchor ? panelId : undefined}
        aria-label={`Playback speed (current ${formatSpeed(value)})`}
      >
        {formatSpeed(value)}
      </SpeedPill>
      <Popover
        id={panelId}
        // Below the pill, right-aligned with it, so it doesn't cover the lesson title.
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        // MUI has no theme here, so its default white paper ignores dark mode.
        slotProps={{
          paper: {
            role: "dialog",
            "aria-label": "Playback speed",
            sx: { backgroundColor: "var(--bg-secondary)", borderRadius: "16px" },
          },
        }}
      >
        <SpeedPanelContent value={value} onChange={onChange} />
      </Popover>
    </>
  );
}
