import * as o from "./ActivitySummary.sc";
import { calculateStats, formatDurationShort } from "./sessionStats";

const KINDS = [
  { key: "reading", label: "Reading" },
  { key: "exercise", label: "Exercises" },
  { key: "browsing", label: "Browsing" },
  { key: "audio", label: "Listening" },
];

// The period at a glance: one bar split by kind of activity (the class list's
// bar, in the same colours), and under it what each part stands for. Shared
// by the learner's History and the teacher's view of a student.
export default function ActivitySummary({ sessions }) {
  const stats = calculateStats(sessions);
  const kinds = KINDS.filter(({ key }) => stats[key].time > 0);
  const total = kinds.reduce((sum, { key }) => sum + stats[key].time, 0);
  if (total === 0) return null;

  return (
    <o.Summary>
      <o.TotalRow>
        <o.Bar>
          {kinds.map(({ key }) => (
            <o.Segment key={key} $kind={key} style={{ width: `${(100 * stats[key].time) / total}%` }} />
          ))}
        </o.Bar>
        <o.Total>{formatDurationShort(total)}</o.Total>
      </o.TotalRow>
      <o.Legend>
        {kinds.map(({ key, label }) => (
          <o.LegendItem key={key}>
            <o.Dot $kind={key} />
            {label} <b>{formatDurationShort(stats[key].time)}</b>
            {stats[key].words > 0 && <span className="words"> · {stats[key].words} words</span>}
          </o.LegendItem>
        ))}
      </o.Legend>
    </o.Summary>
  );
}
