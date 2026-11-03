import styled from "styled-components";
import { activityReading, activityExercise, activityBrowsing, activityListening } from "./colors";

export const ACTIVITY_COLOR = {
  reading: activityReading,
  exercise: activityExercise,
  browsing: activityBrowsing,
  audio: activityListening,
};

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em 1.4em;
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
  background: ${({ $kind }) => ACTIVITY_COLOR[$kind]};
`;
