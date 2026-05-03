import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";

export const LessonCard = styled.div`
  padding: 16px;
  background-color: var(--bg-secondary);
  border: 1px solid ${zeeguuOrange};
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
