import { useId } from "react";
import { Slider } from "@mui/material";
import { sliderSx } from "../components/SpeedPicker";

// The lengths an A0 lesson can be asked for (api: lesson_tuning.LESSON_MINUTES_CHOICES).
// "Too short" / "Too long" after a lesson move it one step, so the learner sees
// here what their answers did, and can set it themselves.
export const LESSON_MINUTES = [5, 10, 15, 20, 25];

/** minutes: the current length, as the string the preference is stored as. */
export default function LessonLengthSlider({ minutes, onChange }) {
  const labelId = useId();
  return (
    <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      <span id={labelId} style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
        Lesson length: <strong style={{ color: "var(--text-primary)" }}>about {minutes} minutes</strong>
      </span>
      <Slider
        aria-labelledby={labelId}
        getAriaValueText={(value) => `${value} minutes`}
        value={Number(minutes)}
        min={LESSON_MINUTES[0]}
        max={LESSON_MINUTES[LESSON_MINUTES.length - 1]}
        step={null}
        marks={LESSON_MINUTES.map((value) => ({ value }))}
        onChange={(_, value) => onChange(String(value))}
        sx={{ ...sliderSx, width: "90%" }}
      />
    </div>
  );
}
