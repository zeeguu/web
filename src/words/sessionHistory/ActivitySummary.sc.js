import styled from "styled-components";
import { activityReading, activityExercise, activityBrowsing, activityListening } from "../../components/colors";

const KIND_COLOR = {
  reading: activityReading,
  exercise: activityExercise,
  browsing: activityBrowsing,
  audio: activityListening,
};

export const Summary = styled.section`
  width: 100%;
  margin: 0.5em 0 1.5em;
`;

export const TotalRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
`;

export const Bar = styled.div`
  flex: 1;
  height: 14px;
  display: flex;
  border-radius: 7px;
  overflow: hidden;
  background: var(--bg-tertiary);
`;

export const Segment = styled.div`
  height: 100%;
  background: ${({ $kind }) => KIND_COLOR[$kind]};
`;

export const Total = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em 1.4em;
  margin-top: 0.6em;
  font-size: 0.9rem;
  color: var(--text-secondary);

  b {
    color: var(--text-primary);
  }
`;

export const LegendItem = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 0.35em;
`;

export const Dot = styled.span`
  width: 0.65em;
  height: 0.65em;
  border-radius: 50%;
  align-self: center;
  background: ${({ $kind }) => KIND_COLOR[$kind]};
`;
