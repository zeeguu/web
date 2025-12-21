import styled, { css } from "styled-components";
import { zeeguuOrange } from "../components/colors";

export const GearWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 0.3rem;
`;

export const GearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 0.25rem;
  background: transparent;
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  ${({ $isActive }) =>
    $isActive &&
    css`
      color: ${zeeguuOrange};
    `}

  &:hover {
    color: ${zeeguuOrange};
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
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
