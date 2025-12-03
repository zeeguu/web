import styled from "styled-components";
import { orange600, white } from "../colors";
import { sideNavExpandedWidth, sideNavCollapsedWidth } from "../MainNav/SideNav/SideNav.sc";
import { MEDIUM_WIDTH, MOBILE_WIDTH } from "../MainNav/screenSize";

export const InstructionContainer = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
  z-index: 9999;

  @media (min-width: ${MEDIUM_WIDTH}px) {
    left: ${sideNavExpandedWidth};
  }

  @media (min-width: ${MOBILE_WIDTH}px) and (max-width: ${MEDIUM_WIDTH - 1}px) {
    left: ${sideNavCollapsedWidth};
  }
`;

export const InstructionBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  max-width: 300px;
  width: 80%;
  background: ${white};
  border-radius: 24px;
  padding: 28px 24px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
  text-align: center;
`;

export const IconWrapper = styled.div`
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ConfirmButton = styled.button`
  width: 70%;
  padding: 12px;
  background: ${orange600};
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: opacity 0.15s ease-in-out;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
  }
`;

export const InstructionText = styled.p`
  margin: 24px 0;
  font-size: 16px;
  line-height: 1.4;
  color: #222;
`;
