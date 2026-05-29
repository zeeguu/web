import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";

export const GearWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 0.3rem;
`;

export const GearButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
  font-size: 0.85rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    color 0.2s ease-in-out,
    border-color 0.2s ease-in-out;

  &:hover {
    color: ${zeeguuOrange};
    border-color: rgba(255, 255, 255, 0.18);
  }
`;
