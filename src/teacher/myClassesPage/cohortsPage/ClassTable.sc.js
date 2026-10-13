import styled from "styled-components";
import { activityReading, activityExercise, activityBrowsing, activityListening } from "../../../components/colors";

const KIND_COLOR = {
  reading_time: activityReading,
  exercise_time: activityExercise,
  browsing_time: activityBrowsing,
  audio_time: activityListening,
};

// The toolbar over the table: find and sort on the left, the period right.
export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6em;
  margin: 0.5em 0 1em;

  .period {
    margin-left: auto;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-secondary);
    padding: 0 0.6em 0.5em;
    border-bottom: 1px solid var(--border-color);
    white-space: nowrap;
  }

  td {
    padding: 0.6em;
    border-bottom: 1px solid var(--border-light);
    vertical-align: middle;
    color: var(--text-primary);
  }

  th.num,
  td.num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`;

export const Row = styled.tr`
  cursor: pointer;
  @media (hover: hover) {
    &:hover td {
      background: var(--bg-secondary);
    }
  }
`;

export const Name = styled.div`
  font-weight: 600;
`;

export const Sub = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);

  &.duplicate {
    font-style: italic;
  }
`;

export const Muted = styled.span`
  color: var(--text-secondary);
`;

export const TimeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6em;
  min-width: 12em;
`;

export const Bar = styled.div`
  flex: 1;
  height: 10px;
`;

export const BarFill = styled.div`
  display: flex;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
`;

export const Segment = styled.div`
  height: 100%;
  background: ${({ $kind }) => KIND_COLOR[$kind]};
`;

export const Minutes = styled.span`
  min-width: 4.5em;
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

export const Remove = styled.button`
  border: none;
  background: none;
  padding: 0 0.3em;
  font-size: 1.1rem;
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
  @media (hover: hover) {
    &:hover {
      color: var(--text-primary);
    }
  }
`;

// A header that sorts its column: the label, and an arrow when it is the
// column the table is sorted by.
export const SortButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  text-transform: inherit;
  letter-spacing: inherit;
  color: ${({ $active }) => ($active ? "var(--text-primary)" : "inherit")};
  cursor: pointer;

  .arrow {
    display: inline-block;
    width: 1em;
    margin-left: 0.2em;
    font-size: 0.8em;
  }
  @media (hover: hover) {
    &:hover {
      color: var(--text-primary);
    }
  }
`;
