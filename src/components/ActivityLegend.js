import * as l from "./ActivityLegend.sc";

// The kinds of activity, in the order the activity bars show them. The same
// colour stands for the same kind wherever activity is broken down by kind.
export const ACTIVITY_KINDS = [
  { key: "reading", label: "Reading" },
  { key: "exercise", label: "Exercises" },
  { key: "browsing", label: "Browsing" },
  { key: "audio", label: "Listening" },
];

// What each colour of an activity bar stands for. `kinds` narrows it to the
// kinds on screen; `detail(key)` adds something after a label (e.g. the time).
export default function ActivityLegend({ kinds = ACTIVITY_KINDS, detail, className }) {
  return (
    <l.Legend className={className}>
      {kinds.map(({ key, label }) => (
        <l.LegendItem key={key}>
          <l.Dot $kind={key} />
          {label}
          {detail && detail(key)}
        </l.LegendItem>
      ))}
    </l.Legend>
  );
}
