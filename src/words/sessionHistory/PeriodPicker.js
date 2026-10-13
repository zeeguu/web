import { useState } from "react";
import Button from "../../pages/_pages_shared/Button.sc";
import * as s from "./PeriodPicker.sc";
import { PRESETS, dateInputValue } from "./periodRange";

// Which stretch of time a History page shows: a preset, or a from/to pair the
// viewer picks and applies. Shared by the learner's History and the teacher's
// view of a student.
//
// onChange(period, custom): period is a PRESETS key or "custom"; custom is
// { from, to } (yyyy-mm-dd) once applied.
export default function PeriodPicker({ period, custom, onChange, busy = false }) {
  const [from, setFrom] = useState(custom?.from || dateInputValue(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));
  const [to, setTo] = useState(custom?.to || dateInputValue(new Date()));

  const customDates = period === "custom" && (
    <s.CustomDates>
      <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} aria-label="From" />
      <span>to</span>
      <input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} aria-label="To" />
      <Button className="small" onClick={() => onChange("custom", { from, to })} disabled={busy || !from || !to}>
        {busy ? "Loading..." : "Apply"}
      </Button>
    </s.CustomDates>
  );

  return (
    <s.PeriodPicker>
      <select value={period} onChange={(e) => onChange(e.target.value, custom)} aria-label="Period">
        {PRESETS.map((p) => (
          <option key={p.key} value={p.key}>
            {p.label}
          </option>
        ))}
        <option value="custom">Custom range</option>
      </select>
      {customDates}
    </s.PeriodPicker>
  );
}
