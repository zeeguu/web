import styled from "styled-components";
import {
  activityReading,
  activityExercise,
  activityBrowsing,
  activityListening,
  successGreen,
  errorRed,
} from "../../components/colors";

const KIND_COLOR = {
  reading: activityReading,
  exercise: activityExercise,
  browsing: activityBrowsing,
  audio: activityListening,
};

// One session: no card, a line between sessions, and a bar on the left in
// its kind's colour (the overview's and the class list's colours).
// A day's sessions take the whole width, however short its rows.
export const Day = styled.section`
  width: 100%;
  margin-bottom: 1.5em;
`;

export const SessionRow = styled.article`
  border-left: 4px solid ${({ $kind }) => KIND_COLOR[$kind]};
  padding: 0.9em 0 0.9em 1em;
  margin-bottom: 0.75em;
  border-bottom: 1px solid var(--border-color);
`;

export const Head = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1em;
`;

export const Title = styled.h3`
  flex: 1;
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--text-primary);

  a {
    color: inherit;
    text-decoration: none;
  }
  @media (hover: hover) {
    a:hover {
      text-decoration: underline;
    }
  }
`;

// The first thing a teacher reads: how long.
export const Duration = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  white-space: nowrap;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
`;

export const Details = styled.div`
  margin-top: 0.2em;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

// In red, like the time away over a reading's focus strip.
export const Distracted = styled.span`
  margin-left: 0.6em;
  font-weight: 600;
  color: ${errorRed};
`;

// A session with nothing but its time and length: one quiet line.
// "🏋 5 practised since" on the details line: the dumbbell on the words, said
// once in words.
export const Practised = styled.span`
  margin-left: 0.6em;
  white-space: nowrap;

  .icon {
    font-size: 1em;
    vertical-align: -0.15em;
    margin-right: 0.2em;
  }
`;

export const SlimRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-left: 4px solid ${({ $kind }) => KIND_COLOR[$kind]};
  padding: 0.5em 0 0.5em 1em;
  margin-bottom: 0.75em;
  border-bottom: 1px solid var(--border-color);
  gap: 1em;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export const Pairs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em 1.4em;
  margin-top: 0.7em;
`;

// A translated word over its translation; no box.
export const Pair = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  text-align: left;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  .origin {
    color: var(--text-primary);
  }
  .translation {
    font-size: 0.85em;
    color: var(--text-secondary);
    max-width: 14em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mark {
    margin-left: 0.25em;
    font-size: 0.85em;
    vertical-align: -0.1em;
    color: var(--text-secondary);
  }
  &[aria-expanded="true"] .origin {
    text-decoration: underline;
  }
`;

export const More = styled.button`
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-size: 0.85em;
  color: var(--text-secondary);
  cursor: pointer;
  text-decoration: underline;
`;

export const Result = styled.span`
  margin-left: 0.2em;
  font-weight: 700;
  color: ${({ $ok }) => ($ok ? successGreen : errorRed)};
`;

export const ExerciseGroup = styled.div`
  margin-top: 0.6em;
`;

export const GroupLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
`;

// The article a browsing session's words were translated in, above them.
export const ArticleLabel = styled.div`
  margin-top: 0.8em;
  font-size: 0.85em;
  color: var(--text-secondary);

  a {
    color: inherit;
  }
`;

export const ArticleGroup = styled.div`
  ${ArticleLabel} + ${Pairs} {
    margin-top: 0.3em;
  }
`;

// A reading session along its length: on the page in the reading colour,
// away in red, the article closed in grey. A departure is at least 2px, so a
// two-second one still shows.
// The figures, then the strip under them.
export const FocusBlock = styled.div`
  margin-top: 0.6em;
`;

// The strip, and the session's minutes large at its end.
export const FocusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6em;
`;

export const FocusStrip = styled.div`
  position: relative;
  flex: 0 1 auto;
  min-width: 2px;
  height: 8px;
  border-radius: 3px;
  overflow: hidden;
  background: ${({ $kind }) => KIND_COLOR[$kind]};
`;

const STRETCH_COLOR = {
  away: errorRed,
  idle: "var(--border-color)",
  closed: "var(--text-muted)",
};

export const Away = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  min-width: 2px;
  background: ${({ $kind }) => STRETCH_COLOR[$kind]};
`;

// "10 min away, left the article 32 times", under the strip.
export const BarLabel = styled.div`
  margin-top: 0.3em;
  font-size: 0.85em;
  white-space: nowrap;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;

  .away {
    color: ${errorRed};
    font-weight: 600;
  }
`;

// What the focus strips' colours mean, once above the sessions.
export const StripLegend = styled.div`
  margin-top: 1em;
  font-size: 0.85em;
  color: var(--text-secondary);

  .reading {
    color: ${activityReading};
  }
  .exercise {
    color: ${activityExercise};
  }
  .away {
    color: ${errorRed};
  }
  .idle {
    color: var(--border-color);
  }
  .closed {
    color: var(--text-muted);
  }
`;

// A session's minutes, large at the end of its focus strip (as in the corner
// of the other cards), in its colour: they are the strip's coloured part.
export const StripMinutes = styled.span`
  flex: none;
  font-size: 1.25rem;
  font-weight: 700;
  white-space: nowrap;
  color: ${({ $kind }) => KIND_COLOR[$kind]};
  font-variant-numeric: tabular-nums;
`;
