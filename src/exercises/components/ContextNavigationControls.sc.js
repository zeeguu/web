import styled, { css, keyframes } from "styled-components";
import { darkGrey, zeeguuOrange } from "../../components/colors";

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
`;

export const SlideContent = styled.div`
  touch-action: pan-y;

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

export const NavigationContainer = styled.div`
  margin-top: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ChangeExampleLink = styled.button`
  background: none;
  border: none;
  padding: 0.3em 0.6em;
  cursor: pointer;
  color: ${darkGrey};
  font-size: 0.85em;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover:not(:disabled) {
    color: ${zeeguuOrange};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
