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

export const CompletionCheck = styled.span`
  color: ${successGreen};
  font-size: 20px;
`;
