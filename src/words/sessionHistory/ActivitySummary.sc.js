import styled from "styled-components";
import ActivityLegend from "../../components/ActivityLegend";
import { ACTIVITY_COLOR } from "../../components/ActivityLegend.sc";

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
  background: ${({ $kind }) => ACTIVITY_COLOR[$kind]};
`;

export const Total = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
`;

// the shared legend, with room above it for the bar
export const Legend = styled(ActivityLegend)`
  margin-top: 0.6em;
`;
