import styled from "styled-components";
import { activityReading, activityExercise, activityBrowsing, activityListening } from "../../components/colors";

const KIND_COLOR = {
  reading: activityReading,
  exercise: activityExercise,
  browsing: activityBrowsing,
  audio: activityListening,
};

// One session: no card, a line between sessions, and a bar on the left in
// its kind's colour (the overview's and the class list's colours).
export const SessionRow = styled.article`
  border-left: 4px solid ${({ $kind }) => KIND_COLOR[$kind]};
  padding: 0.9em 0 0.9em 1em;
  border-bottom: 1px solid var(--border-light);
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

export const Distracted = styled.span`
  margin-left: 0.6em;
  font-weight: 600;
  color: var(--text-primary);
`;

// A session with nothing but its time and length: one quiet line.
export const SlimRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-left: 4px solid ${({ $kind }) => KIND_COLOR[$kind]};
  padding: 0.5em 0 0.5em 1em;
  border-bottom: 1px solid var(--border-light);
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
  }
  .mark {
    margin-left: 0.25em;
    font-size: 0.85em;
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
