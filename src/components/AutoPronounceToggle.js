import React from "react";
import styled from "styled-components";
import { zeeguuOrange, white } from "./colors";

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  cursor: pointer;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 32px;
  height: 16px;
  background-color: ${(props) => (props.$enabled ? zeeguuOrange : "var(--border-color)")};
  border-radius: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:before {
    content: "";
    position: absolute;
    top: 2px;
    left: ${(props) => (props.$enabled ? "18px" : "2px")};
    width: 12px;
    height: 12px;
    background-color: ${white};
    border-radius: 50%;
    transition: left 0.2s ease;
  }
`;

const ToggleLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
`;

export default function AutoPronounceToggle({ enabled, onToggle, label = "Auto-pronounce solution" }) {
  return (
    <ToggleContainer onClick={onToggle}>
      <ToggleSwitch $enabled={enabled} />
      <ToggleLabel>{label}</ToggleLabel>
    </ToggleContainer>
  );
}
