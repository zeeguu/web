import styled, { css, keyframes } from "styled-components";
import { darkGrey } from "../../components/colors";

const slideInFromRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInFromLeft = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const SlideContainer = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export const NavRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5em;
  margin-top: 0.4em;
  visibility: ${(props) => (props.$hidden ? "hidden" : "visible")};
  pointer-events: ${(props) => (props.$hidden ? "none" : "auto")};
`;

export const SlideContent = styled.div`
  touch-action: pan-y;
  flex: 1;

  ${props => props.$exiting && css`
    opacity: 0;
    transform: translateX(${props.$direction === 'left' ? '-100%' : '100%'});
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  `}

  ${props => props.$entering && props.$direction === 'left' && css`
    animation: ${slideInFromRight} 0.25s ease-out;
  `}

  ${props => props.$entering && props.$direction === 'right' && css`
    animation: ${slideInFromLeft} 0.25s ease-out;
  `}
`;

export const NavArrow = styled.button`
  background: none;
  border: none;
  padding: 0.5em 0.8em;
  cursor: pointer;
  color: #ccc;
  font-size: 1.5em;
  line-height: 1;
  user-select: none;

  &:hover:not(:disabled) {
    color: ${darkGrey};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;
