import styled from "styled-components";
import { zeeguuOrange, successGreen } from "../components/colors";

export const LessonCard = styled.div`
  padding: 16px;
  background-color: ${({ $subtle, $isCompleted }) =>
    $subtle
      ? $isCompleted
        ? "rgba(40, 167, 69, 0.08)"
        : "rgba(255, 187, 84, 0.06)"
      : "transparent"};
  border: ${({ $subtle, $isCompleted }) =>
    $subtle ? "none" : `1px solid ${$isCompleted ? successGreen : zeeguuOrange}`};
  border-radius: 6px;
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
