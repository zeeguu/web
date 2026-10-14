import styled, { css, keyframes } from "styled-components";
import { zeeguuOrange } from "../../components/colors";

const slideInFromRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInFromLeft = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// First-view hint that the sentence can be swiped: it slides partway to
// the left, fading a little, and comes back.
const peek = keyframes`
  0%   { transform: translateX(0); }
  35%  { transform: translateX(-2.5em); opacity: 0.5; }
  65%  { transform: translateX(-2.5em); opacity: 0.5; }
  100% { transform: translateX(0); }
`;

export const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.6em;
`;

// The swipe target. Holds the slide-in/out content and, on first view,
// the hint that slides it partway to the left and back.
export const SwipeArea = styled.div`
  overflow: hidden;
  touch-action: pan-y;

  ${(props) =>
    props.$peek &&
    css`
      @media (prefers-reduced-motion: no-preference) {
        & > * {
          animation: ${peek} 1.1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s 1;
        }
      }
    `}
`;

export const SlideContent = styled.div`
  ${(props) =>
    props.$exiting &&
    css`
      opacity: 0;
      transform: translateX(${props.$direction === "left" ? "-100%" : "100%"});
      transition:
        opacity 0.2s ease-out,
        transform 0.2s ease-out;
    `}

  ${(props) =>
    props.$entering &&
    props.$direction === "left" &&
    css`
      animation: ${slideInFromRight} 0.25s ease-out;
    `}

  ${(props) =>
    props.$entering &&
    props.$direction === "right" &&
    css`
      animation: ${slideInFromLeft} 0.25s ease-out;
    `}
`;

// Arrows either side of the dots, only on devices that hover; touch
// devices swipe instead.
export const NavArrow = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 0 0.4em;
  color: var(--text-muted);
  font-size: 1.3em;
  line-height: 1;
  cursor: pointer;
  user-select: none;

  @media (hover: hover) {
    display: block;

    &:hover:not(:disabled) {
      color: var(--text-primary);
    }
  }
`;

export const Dots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
  min-height: 1.5em;
`;

export const Dot = styled.button`
  width: 0.5em;
  height: 0.5em;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${(props) => (props.$current ? zeeguuOrange : "var(--border-color)")};
  transform: scale(${(props) => (props.$current ? 1.25 : 1)});
  transition:
    background-color 0.15s,
    transform 0.15s;
`;

// Too many examples for dots: "3 / 9" instead.
export const Counter = styled.span`
  font-size: 0.8em;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
`;
