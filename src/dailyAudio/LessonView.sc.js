import styled from "styled-components";
import { zeeguuOrange, successGreen } from "../components/colors";

export const LessonWrapper = styled.div`
  padding: 20px;
`;

export const LessonTitle = styled.h2`
  color: ${zeeguuOrange};
  margin-bottom: ${({ $compact }) => ($compact ? "4px" : "10px")};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SuggestionSubtitle = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
`;

export const LessonLanguageBadge = styled.span`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
  padding: 2px 10px;
  border-radius: 12px;
  margin-bottom: 10px;
`;

export const CompletionCheck = styled.span`
  color: ${successGreen};
  font-size: 20px;
`;

export const SubtleTextButton = styled.button`
  background-color: transparent;
  color: var(--text-faint);
  border: none;
  border-radius: 0;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
`;
