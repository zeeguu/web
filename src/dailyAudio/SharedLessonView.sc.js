import styled from "styled-components";
import { zeeguuOrange, successGreen } from "../components/colors";

export const LessonCard = styled.div`
  padding: 0;
  background-color: transparent;
  border: none;
`;

export const SubtleLessonCard = styled.div`
  padding: 10px 14px;
  border-radius: 14px;
  -webkit-tap-highlight-color: transparent;
  background-color: var(--card-bg);
  box-shadow: 0 1px 3px var(--shadow-color);
`;

export const ProgressBarTrack = styled.div`
  height: 4px;
  background-color: var(--border-light);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 4px;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => `${$pct}%`};
  background-color: ${({ $isCompleted }) => ($isCompleted ? successGreen : zeeguuOrange)};
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

export const ShareNote = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  color: var(--text-secondary);
  font-size: 14px;
`;

export const BannerButton = styled.button`
  background-color: ${zeeguuOrange};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
`;
