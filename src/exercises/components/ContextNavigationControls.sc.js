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
  align-items: center;
  justify-content: center;
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
  padding: 0.5em;
  cursor: pointer;
  color: #ccc;
  font-size: 1.5em;
  line-height: 1;
  user-select: none;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    color: ${darkGrey};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;
