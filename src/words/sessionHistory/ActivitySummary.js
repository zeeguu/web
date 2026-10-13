import * as s from "../SessionHistory.sc";
import { calculateStats, formatDurationShort } from "./sessionStats";

// The Overview card: time per kind of activity, as numbers and as bars.
// Shared by the learner's History and the teacher's view of a student.
export default function Summary({ sessions, label }) {
  const stats = calculateStats(sessions);
  const maxTime = Math.max(stats.reading.time, stats.exercise.time, stats.browsing.time, stats.audio.time, 1);

  return (
    <>
      <s.SummaryCard>
        <s.SummaryTitle>{label}</s.SummaryTitle>

        <s.StatsRow>
          <s.StatItem color="#1565c0">
            <div className="label">Reading</div>
            <div className="time">{formatDurationShort(stats.reading.time)}</div>
            {stats.reading.words > 0 && <div className="words">{stats.reading.words} words</div>}
          </s.StatItem>
          <s.StatItem color="#2e7d32">
            <div className="label">Exercises</div>
            <div className="time">{formatDurationShort(stats.exercise.time)}</div>
            {stats.exercise.words > 0 && <div className="words">{stats.exercise.words} words</div>}
          </s.StatItem>
          {stats.audio.time > 0 && (
            <s.StatItem color="#7b1fa2">
              <div className="label">Listening</div>
              <div className="time">{formatDurationShort(stats.audio.time)}</div>
              {stats.audio.words > 0 && <div className="words">{stats.audio.words} words</div>}
            </s.StatItem>
          )}
          {stats.browsing.time > 0 && (
            <s.StatItem color="#ff8f00">
              <div className="label">Browsing</div>
              <div className="time">{formatDurationShort(stats.browsing.time)}</div>
              {stats.browsing.words > 0 && <div className="words">{stats.browsing.words} words</div>}
            </s.StatItem>
          )}
        </s.StatsRow>

        <s.BarChartContainer>
          <s.BarRow>
            <span className="label">Reading</span>
            <div className="bar-wrapper">
              <div className="bar reading" style={{ width: `${(stats.reading.time / maxTime) * 100}%` }} />
            </div>
            <span className="time">{formatDurationShort(stats.reading.time)}</span>
          </s.BarRow>
          <s.BarRow>
            <span className="label">Exercising</span>
            <div className="bar-wrapper">
              <div className="bar exercise" style={{ width: `${(stats.exercise.time / maxTime) * 100}%` }} />
            </div>
            <span className="time">{formatDurationShort(stats.exercise.time)}</span>
          </s.BarRow>
          {stats.audio.time > 0 && (
            <s.BarRow>
              <span className="label">Listening</span>
              <div className="bar-wrapper">
                <div className="bar audio" style={{ width: `${(stats.audio.time / maxTime) * 100}%` }} />
              </div>
              <span className="time">{formatDurationShort(stats.audio.time)}</span>
            </s.BarRow>
          )}
          {stats.browsing.time > 0 && (
            <s.BarRow>
              <span className="label">Browsing</span>
              <div className="bar-wrapper">
                <div className="bar browsing" style={{ width: `${(stats.browsing.time / maxTime) * 100}%` }} />
              </div>
              <span className="time">{formatDurationShort(stats.browsing.time)}</span>
            </s.BarRow>
          )}
        </s.BarChartContainer>
      </s.SummaryCard>
    </>
  );
}
