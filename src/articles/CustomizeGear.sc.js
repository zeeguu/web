import styled, { css } from "styled-components";
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
  transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out;

  ${({ $isActive }) =>
    $isActive &&
    css`
      color: ${zeeguuOrange};
      border-color: ${zeeguuOrange};
    `}

  &:hover {
    color: ${zeeguuOrange};
    border-color: rgba(255, 255, 255, 0.18);
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  min-width: 120px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
`;

export const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.6rem 1rem;
  border: none;
  background: transparent;
  color: #333;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f5f5f5;
  }
`;
