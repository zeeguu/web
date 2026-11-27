import { useId } from "react";
import { Slider } from "@mui/material";
import { sliderSx } from "../components/SpeedPicker";

/**
 * A lesson setting chosen from a few steps, shown as "<label>: <value>" over a
 * slider that stops only at the steps (the lesson length, the time to answer).
 *
 * steps: [{ value: number, label: string }], in order; value: the current
 * step's value (a number); onChange(value): a step was chosen.
 */
export default function StepSlider({ label, steps, value, onChange }) {
  const labelId = useId();
  const current = steps.find((step) => step.value === value);
  return (
    <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      <span id={labelId} style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
        {label}: <strong style={{ color: "var(--text-primary)" }}>{current?.label}</strong>
      </span>
      <Slider
        aria-labelledby={labelId}
        getAriaValueText={(v) => steps.find((step) => step.value === v)?.label ?? String(v)}
        value={value}
        min={steps[0].value}
        max={steps[steps.length - 1].value}
        step={null}
        marks={steps.map((step) => ({ value: step.value }))}
        onChange={(_, v) => onChange(v)}
        sx={{ ...sliderSx, width: "90%" }}
      />
    </div>
  );
}
